/**
 * Jediný zdroj adresy backendu pro mobilní aplikaci.
 *
 * Adresa backendu je veřejná (https) a není tajemstvím —
 * je to náš vlastní server (teona-api na ops, kontejner teona-api-app,
 * port 3055, nginx api.teona.it-enterprise.cloud -> 127.0.0.1:3055).
 *
 * Aby se adresa dala změnit na jednom místě, všechny services
 * importují API_BASE_URL z tohoto souboru.
 */
export const API_BASE_URL = "https://api.teona.it-enterprise.cloud/v1";
