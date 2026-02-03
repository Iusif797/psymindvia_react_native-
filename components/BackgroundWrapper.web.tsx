import React from "react";

const wrapperStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={wrapperStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
