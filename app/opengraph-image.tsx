import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TimeBACK Founders Club — AI Growth Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #a83ac4, #6366f1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ color: "white", fontSize: "28px", fontWeight: "800" }}
            >
              R
            </span>
          </div>
          <span
            style={{ color: "#9ca3af", fontSize: "20px", fontWeight: "500" }}
          >
            RazoRSharp Networks
          </span>
        </div>
        <h1
          style={{
            color: "white",
            fontSize: "64px",
            fontWeight: "800",
            textAlign: "center",
            lineHeight: "1.1",
            margin: "0 0 16px 0",
          }}
        >
          TimeBACK Founders Club
        </h1>
        <p
          style={{
            color: "#a78bfa",
            fontSize: "28px",
            fontWeight: "600",
            margin: "0 0 12px 0",
          }}
        >
          Your AI Growth Engineer for $9
        </p>
        <p
          style={{
            color: "#6b7280",
            fontSize: "20px",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0",
          }}
        >
          Meet CATO — 24/7 growth engineering, daily coaching, CRM automation.
          Your business should run without you.
        </p>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "32px",
          }}
        >
          <span style={{ color: "#4b5563", fontSize: "16px" }}>✦ Audit</span>
          <span style={{ color: "#4b5563", fontSize: "16px" }}>
            ✦ Optimize
          </span>
          <span style={{ color: "#4b5563", fontSize: "16px" }}>✦ Measure</span>
          <span style={{ color: "#4b5563", fontSize: "16px" }}>✦ Refill</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
