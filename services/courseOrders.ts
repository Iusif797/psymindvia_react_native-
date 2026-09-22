import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Course enquiry ("заявка") capture.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * The app sells NOTHING. Courses and consultations are arranged, contracted and
 * invoiced entirely outside the app, by the psychologist. This module only
 * captures an ENQUIRY — "this person is interested in this course, here is how
 * to reach them" — and delivers it to our own intake endpoint, from where it is
 * handed to accounting / Odoo.
 *
 * Consequently there is deliberately:
 *   - no payment of any kind in the app,
 *   - no price-gated or unlockable content: everything already in the app is
 *     free and stays free whether or not an enquiry is ever sent,
 *   - no purchase confirmation — the user is told, in the UI, that this is a
 *     request and that money is discussed outside the app.
 *
 * DELIVERY
 * --------
 * Enquiries POST to our own backend (see /opt/teona-api on the ops node), which
 * writes them to a Postgres table we control. If the network call fails the
 * enquiry is kept in a local outbox and retried, so a request is never silently
 * lost. It is explicitly NOT a `mailto:` hand-off — that depends on the user
 * having a configured mail client and on them remembering to press send, which
 * is how enquiries get lost.
 */

/**
 * Single source of truth for the backend location, and the ONLY backend host
 * this app talks to.
 *
 * This value is COMPILED INTO THE BINARY: changing it later costs a full app
 * update and an App Store review, so it is settled BEFORE the build goes out.
 *
 * It is a branded hostname under `it-enterprise.cloud` — our own domain for the
 * services we run (`.pro` = internal systems, `.solutions` = portfolio,
 * `.cloud` = services we run, `.cz`/`.eu` = marketing). Everything the app sends
 * goes to our company infrastructure and nowhere else.
 */
import { API_BASE_URL } from "./config";

const OUTBOX_KEY = "course_order_outbox_v1";
const REQUEST_TIMEOUT_MS = 15000;
const MAX_OUTBOX_ENTRIES = 20;

export type ContactPref = "email" | "phone" | "whatsapp" | "telegram";

export interface CourseOrderDraft {
  courseId: string;
  courseTitle: string;
  coursePrice?: string;
  name: string;
  email: string;
  phone?: string;
  contactPref?: ContactPref;
  note?: string;
}

interface OutboxEntry {
  clientRequestId: string;
  payload: Record<string, unknown>;
  queuedAt: string;
  attempts: number;
}

export type SubmitResult =
  | { status: "sent"; orderId: string }
  | { status: "queued" }
  | { status: "invalid"; fields: Record<string, string> };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateOrder(
  draft: CourseOrderDraft
): Record<string, string> {
  const fields: Record<string, string> = {};

  const name = draft.name?.trim() ?? "";
  if (name.length < 2) {
    fields.name = "Укажите ваше имя";
  } else if (name.length > 120) {
    fields.name = "Имя слишком длинное";
  }

  const email = draft.email?.trim() ?? "";
  if (!email) {
    fields.email = "Введите email";
  } else if (!EMAIL_REGEX.test(email)) {
    fields.email = "Некорректный формат email";
  }

  const phone = draft.phone?.trim() ?? "";
  if (phone.length > 40) {
    fields.phone = "Слишком длинный номер";
  }

  if ((draft.note?.trim().length ?? 0) > 2000) {
    fields.note = "Сообщение слишком длинное";
  }

  if (!draft.courseId?.trim() || !draft.courseTitle?.trim()) {
    fields.course = "Выберите курс";
  }

  return fields;
}

/** RFC4122-shaped id. Only used as an idempotency key, not as a secret. */
export function newRequestId(): string {
  const globalCrypto = (
    globalThis as { crypto?: { randomUUID?: () => string } }
  ).crypto;
  if (typeof globalCrypto?.randomUUID === "function") {
    return globalCrypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function buildPayload(
  draft: CourseOrderDraft,
  clientRequestId: string,
  context: { platform?: string; appVersion?: string } = {}
): Record<string, unknown> {
  return {
    client_request_id: clientRequestId,
    course_id: draft.courseId.trim(),
    course_title: draft.courseTitle.trim(),
    course_price: draft.coursePrice?.trim() || undefined,
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone?.trim() || undefined,
    contact_pref: draft.contactPref ?? "email",
    note: draft.note?.trim() || undefined,
    locale: "ru",
    platform: context.platform,
    app_version: context.appVersion,
  };
}

async function readOutbox(): Promise<OutboxEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOutbox(entries: OutboxEntry[]): Promise<void> {
  await AsyncStorage.setItem(
    OUTBOX_KEY,
    JSON.stringify(entries.slice(-MAX_OUTBOX_ENTRIES))
  );
}

export async function getPendingCount(): Promise<number> {
  return (await readOutbox()).length;
}

async function postOrder(
  payload: Record<string, unknown>
): Promise<{ ok: true; orderId: string } | { ok: false; retryable: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}/course-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.ok) {
      const body = (await response.json()) as { order_id?: string };
      return { ok: true, orderId: body.order_id ?? "" };
    }
    // 4xx other than 429 means this payload will never be accepted; retrying
    // it forever would just wedge the outbox.
    const retryable = response.status === 429 || response.status >= 500;
    return { ok: false, retryable };
  } catch {
    // Network down, DNS failure, timeout — worth retrying.
    return { ok: false, retryable: true };
  } finally {
    clearTimeout(timer);
  }
}

export async function submitCourseOrder(
  draft: CourseOrderDraft,
  context: { platform?: string; appVersion?: string } = {}
): Promise<SubmitResult> {
  const fields = validateOrder(draft);
  if (Object.keys(fields).length > 0) {
    return { status: "invalid", fields };
  }

  const clientRequestId = newRequestId();
  const payload = buildPayload(draft, clientRequestId, context);

  const result = await postOrder(payload);
  if (result.ok) {
    return { status: "sent", orderId: result.orderId };
  }
  if (!result.retryable) {
    return { status: "queued" };
  }

  const outbox = await readOutbox();
  outbox.push({
    clientRequestId,
    payload,
    queuedAt: new Date().toISOString(),
    attempts: 1,
  });
  await writeOutbox(outbox);
  return { status: "queued" };
}

/**
 * Pseudo-course used for the general "Связаться" form, so that every enquiry
 * the app produces lands in one intake table with one delivery guarantee.
 * Accounting filters on this id to tell general messages from course leads.
 */
export const GENERAL_ENQUIRY_COURSE_ID = "general-contact";

export async function submitGeneralEnquiry(
  input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  },
  context: { platform?: string; appVersion?: string } = {}
): Promise<SubmitResult> {
  // Unlike a course enquiry (where the course itself carries the intent), a
  // general message is meaningless without text, so it is required here.
  if (!input.message?.trim()) {
    return { status: "invalid", fields: { message: "Напишите сообщение" } };
  }

  const result = await submitCourseOrder(
    {
      courseId: GENERAL_ENQUIRY_COURSE_ID,
      courseTitle: "Общее обращение из приложения",
      name: input.name,
      email: input.email,
      phone: input.phone,
      contactPref: input.phone?.trim() ? "phone" : "email",
      note: input.message,
    },
    context
  );

  // The contact form calls its free-text field "Сообщение", so map the note
  // error onto that name for the UI.
  if (result.status === "invalid" && result.fields.note) {
    return {
      status: "invalid",
      fields: { ...result.fields, message: result.fields.note },
    };
  }
  return result;
}

/**
 * Retry queued enquiries. Safe to call on every app start: the backend is
 * idempotent on client_request_id, so a retry of something that actually did
 * arrive will not create a duplicate order.
 */
export async function flushOutbox(): Promise<{
  sent: number;
  remaining: number;
}> {
  const outbox = await readOutbox();
  if (outbox.length === 0) return { sent: 0, remaining: 0 };

  const still: OutboxEntry[] = [];
  let sent = 0;

  for (const entry of outbox) {
    const result = await postOrder(entry.payload);
    if (result.ok) {
      sent += 1;
    } else if (result.retryable && entry.attempts < 10) {
      still.push({ ...entry, attempts: entry.attempts + 1 });
    }
    // Non-retryable, or out of attempts: drop it rather than retry forever.
  }

  await writeOutbox(still);
  return { sent, remaining: still.length };
}
