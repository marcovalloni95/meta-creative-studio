import type { Brief } from "./types";
import { safeArea } from "./aspects";
import { getTemplate } from "./templates";
import { wrapText, clamp } from "./text";

function paintBackground(ctx: CanvasRenderingContext2D, w: number, h: number, bg: string) {
  if (bg === "gradientA") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f17");
    g.addColorStop(0.5, "rgba(102,227,255,0.18)");
    g.addColorStop(1, "rgba(125,99,255,0.16)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bg === "gradientB") {
    const g = ctx.createRadialGradient(w*0.3, h*0.2, 20, w*0.6, h*0.6, Math.max(w,h));
    g.addColorStop(0, "rgba(255,255,255,0.06)");
    g.addColorStop(0.35, "rgba(102,227,255,0.14)");
    g.addColorStop(1, "#0b0f17");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bg === "solidLight") {
    ctx.fillStyle = "#f4f7ff";
    ctx.fillRect(0,0,w,h);
    return;
  }
  ctx.fillStyle = "#0b0f17";
  ctx.fillRect(0,0,w,h);
}

function drawSafeFrame(ctx: CanvasRenderingContext2D, b: Brief) {
  const s = safeArea(b.width, b.height);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = Math.max(2, Math.round(b.width * 0.002));
  ctx.setLineDash([10, 10]);
  ctx.strokeRect(s.x, s.y, s.w, s.h);
  ctx.restore();
}

function drawPill(ctx: CanvasRenderingContext2D, x:number, y:number, text:string, invert:boolean) {
  ctx.save();
  ctx.font = `600 ${Math.max(18, Math.round(ctx.canvas.width*0.018))}px ui-sans-serif`;
  const padX = 16, padY = 10;
  const tw = ctx.measureText(text).width;
  const w = tw + padX*2;
  const h = Math.max(32, Math.round(ctx.canvas.height*0.04));
  ctx.fillStyle = invert ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.14)";
  ctx.strokeStyle = invert ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.20)";
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 999);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = invert ? "#ffffff" : "#eaf0ff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x+padX, y + h/2);
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

export function renderBriefToCanvas(canvas: HTMLCanvasElement, brief: Brief) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = brief.width;
  canvas.height = brief.height;

  const t = getTemplate(brief.templateId);
  paintBackground(ctx, brief.width, brief.height, t.bg);

  const s = safeArea(brief.width, brief.height);

  // choose colors based on bg
  const darkBg = t.bg !== "solidLight";
  const textMain = darkBg ? "#eaf0ff" : "#0b0f17";
  const textSub = darkBg ? "rgba(234,240,255,0.82)" : "rgba(11,15,23,0.78)";
  const strokeSoft = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  // layout anchor
  let x = s.x, y = s.y;

  // optional badge for template badgeTop
  if (t.layout === "badgeTop") {
    drawPill(ctx, s.x, s.y, "PROMO / OFFER", !darkBg);
    y += Math.round(s.h * 0.08);
  }

  // split layout: reserve right visual block
  let textW = s.w;
  if (t.layout === "split") {
    const gap = Math.round(s.w * 0.06);
    const leftW = Math.round(s.w * 0.56);
    const rightW = s.w - leftW - gap;
    textW = leftW;

    // draw visual placeholder
    ctx.save();
    ctx.fillStyle = darkBg ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    ctx.strokeStyle = strokeSoft;
    ctx.lineWidth = 2;
    roundRect(ctx, s.x + leftW + gap, s.y, rightW, s.h, 22);
    ctx.fill(); ctx.stroke();
    // simple diagonal lines
    ctx.strokeStyle = darkBg ? "rgba(102,227,255,0.22)" : "rgba(125,99,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(s.x+leftW+gap+20, s.y+40);
    ctx.lineTo(s.x+leftW+gap+rightW-20, s.y+s.h-40);
    ctx.stroke();
    ctx.restore();
  }

  // typography sizes
  const headlinePx = Math.round(clamp(brief.width * 0.055 * t.headlineSize, 34, 96));
  const bodyPx = Math.round(clamp(brief.width * 0.030 * t.bodySize, 18, 44));
  const bulletPx = Math.round(clamp(brief.width * 0.028 * t.bulletSize, 16, 40));
  const ctaPx = Math.round(clamp(brief.width * 0.030 * t.ctaSize, 18, 46));

  const gapY = Math.round(brief.height * 0.022);

  // centerStack: center align within safe area
  const isCenter = t.layout === "centerStack";
  if (isCenter) {
    x = s.x + Math.round(s.w * 0.08);
    textW = Math.round(s.w * 0.84);
    y = s.y + Math.round(s.h * 0.12);
  }

  // headline
  if (brief.includeHeadline && brief.headline) {
    ctx.save();
    ctx.fillStyle = textMain;
    ctx.font = `800 ${headlinePx}px ui-sans-serif`;
    ctx.textBaseline = "top";
    const lines = wrapText(ctx, brief.headline, textW);
    const lh = Math.round(headlinePx * 1.08);
    for (const line of lines.slice(0, 3)) {
      const tx = isCenter ? (s.x + (s.w - ctx.measureText(line).width)/2) : x;
      ctx.fillText(line, tx, y);
      y += lh;
    }
    ctx.restore();
    y += Math.round(gapY * 0.6);
  }

  // body
  if (brief.includeBody && brief.body) {
    ctx.save();
    ctx.fillStyle = textSub;
    ctx.font = `500 ${bodyPx}px ui-sans-serif`;
    ctx.textBaseline = "top";
    const lines = wrapText(ctx, brief.body, textW);
    const lh = Math.round(bodyPx * 1.35);
    for (const line of lines.slice(0, 5)) {
      const tx = isCenter ? (s.x + (s.w - ctx.measureText(line).width)/2) : x;
      ctx.fillText(line, tx, y);
      y += lh;
    }
    ctx.restore();
    y += Math.round(gapY * 0.4);
  }

  // bullets
  if (brief.includeBullets && brief.bullets && brief.bullets.length) {
    ctx.save();
    ctx.fillStyle = textSub;
    ctx.font = `600 ${bulletPx}px ui-sans-serif`;
    ctx.textBaseline = "top";
    const lh = Math.round(bulletPx * 1.45);
    const max = Math.min(4, brief.bullets.length);
    for (let i=0;i<max;i++){
      const btxt = `• ${brief.bullets[i]}`;
      const lines = wrapText(ctx, btxt, textW);
      for (const line of lines.slice(0,2)) {
        const tx = isCenter ? (s.x + (s.w - ctx.measureText(line).width)/2) : x;
        ctx.fillText(line, tx, y);
        y += lh;
      }
      y += Math.round(lh * 0.15);
    }
    ctx.restore();
    y += Math.round(gapY * 0.3);
  }

  // CTA button
  if (brief.includeCTA && brief.cta) {
    ctx.save();
    ctx.font = `800 ${ctaPx}px ui-sans-serif`;
    const tw = ctx.measureText(brief.cta).width;
    const padX = Math.round(ctaPx * 0.9);
    const padY = Math.round(ctaPx * 0.55);
    const bw = tw + padX*2;
    const bh = ctaPx + padY*2;
    const bx = isCenter ? Math.round(s.x + (s.w - bw)/2) : x;
    const by = Math.min(s.y + s.h - bh, y + Math.round(gapY*0.6));

    ctx.fillStyle = darkBg ? "rgba(102,227,255,0.22)" : "rgba(125,99,255,0.15)";
    ctx.strokeStyle = darkBg ? "rgba(102,227,255,0.55)" : "rgba(125,99,255,0.40)";
    ctx.lineWidth = 3;
    roundRect(ctx, bx, by, bw, bh, 999);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textMain;
    ctx.textBaseline = "middle";
    ctx.fillText(brief.cta, bx + padX, by + bh/2);
    ctx.restore();
  }

  // small footer tag
  ctx.save();
  ctx.fillStyle = darkBg ? "rgba(234,240,255,0.55)" : "rgba(11,15,23,0.55)";
  ctx.font = `600 ${Math.max(16, Math.round(brief.width * 0.015))}px ui-sans-serif`;
  const tag = "Generated • Meta Creative Studio";
  ctx.fillText(tag, s.x, s.y + s.h + Math.round(brief.height*0.03) > brief.height ? s.y + s.h - 20 : s.y + s.h + 10);
  ctx.restore();

  // safe frame on top (optional)
  drawSafeFrame(ctx, brief);
}
