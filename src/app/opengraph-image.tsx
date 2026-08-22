import { ImageResponse } from "next/og";

export const alt = "ArticulateX — Make your message land.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "stretch", background: "#111525", color: "#f7f8fc", display: "flex", height: "100%", overflow: "hidden", padding: "72px", position: "relative", width: "100%" }}>
        <div style={{ background: "#3159df", borderRadius: "999px", display: "flex", height: "620px", opacity: 0.72, position: "absolute", right: "-160px", top: "-230px", width: "620px" }} />
        <div style={{ background: "#875ee9", borderRadius: "999px", bottom: "-280px", display: "flex", height: "610px", opacity: 0.7, position: "absolute", right: "170px", width: "610px" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", width: "100%" }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 27, fontWeight: 700, letterSpacing: "-1px" }}>Articulate<span style={{ color: "#9cb4ff" }}>X</span></div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "870px" }}>
            <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-6px", lineHeight: 0.94 }}>Make your message</div>
            <div style={{ color: "#aeb8d1", fontSize: 92, fontWeight: 700, letterSpacing: "-6px", lineHeight: 0.94 }}>land.</div>
          </div>
          <div style={{ color: "#c5ccdd", display: "flex", fontSize: 24 }}>Communication coaching for leaders, founders, and teams.</div>
        </div>
      </div>
    ),
    size,
  );
}
