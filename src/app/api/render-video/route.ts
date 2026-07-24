import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { aspectToPixels } from "../../../lib/aspects";
import type { Aspect } from "../../../lib/types";

const BodySchema = z.object({
  aspect: z.enum(["1:1","4:5","9:16","16:9"]),
  duration: z.enum(["<5","6-30","30-60"]).optional(),
  headline: z.string().optional().default(""),
  body: z.string().optional().default(""),
  bullets: z.array(z.string()).optional().default([]),
  cta: z.string().optional().default(""),
  templateId: z.string().optional().default(""),
});

function pickSeconds(d?: string) {
  if (d === "<5") return 4;
  if (d === "6-30") return 12;
  if (d === "30-60") return 30;
  return 8;
}

function escapeDrawtext(s: string) {
  // Escape characters for ffmpeg drawtext
  return s
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n");
}

async function fileExists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const body = parsed.data;
  const aspect = body.aspect as Aspect;
  const px = aspectToPixels[aspect];
  const seconds = pickSeconds(body.duration);

  // output location inside /public so it's serveable
  const outDir = path.join(process.cwd(), "public", "renders");
  await fs.mkdir(outDir, { recursive: true });

  const id = randomUUID().slice(0, 8);
  const outFile = path.join(outDir, `video_${aspect.replace(":","x")}_${id}.mp4`);
  const url = `/renders/${path.basename(outFile)}`;

  // quick check: ffmpeg present?
  // We just try to spawn and handle ENOENT.
  const headline = escapeDrawtext(body.headline || "");
  const main = escapeDrawtext(body.body || "");
  const cta = escapeDrawtext(body.cta || "");
  const bullets = (body.bullets || []).slice(0, 4).map(b => `• ${b}`).join("\n");
  const bulletsEsc = escapeDrawtext(bullets);

  // Build a simple animated background + text overlays
  // - Background: subtle moving gradient using color + drawbox + geq (lightweight)
  // - Text: drawtext with fade-in/out

  // Use DejaVuSans which is common on Linux; user can adjust if missing.
  const font = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
  const fontArg = await fileExists(font) ? `:fontfile=${font}` : "";

  const w = px.w;
  const h = px.h;

  const headlineY = Math.round(h * 0.14);
  const bodyY = Math.round(h * 0.30);
  const bulletsY = Math.round(h * 0.50);
  const ctaY = Math.round(h * 0.82);

  const headlineSize = Math.max(42, Math.round(w * 0.055));
  const bodySize = Math.max(26, Math.round(w * 0.030));
  const bulletSize = Math.max(24, Math.round(w * 0.028));
  const ctaSize = Math.max(30, Math.round(w * 0.032));

  const common = `:fontcolor=white:shadowcolor=black:shadowx=2:shadowy=2:line_spacing=10`;

  const vfParts: string[] = [];
  // background: base color + moving translucent boxes
  vfParts.push(`format=yuv420p`);
  vfParts.push(`drawbox=x=0:y=0:w=iw:h=ih:color=black@1:t=fill`);
  vfParts.push(`drawbox=x=iw*0.05+sin(t*1.2)*iw*0.02:y=ih*0.08:w=iw*0.90:h=ih*0.22:color=0x66e3ff@0.14:t=fill`);
  vfParts.push(`drawbox=x=iw*0.10+cos(t*1.0)*iw*0.02:y=ih*0.40:w=iw*0.80:h=ih*0.28:color=0x7d63ff@0.12:t=fill`);
  vfParts.push(`drawbox=x=iw*0.12+sin(t*0.8)*iw*0.015:y=ih*0.74:w=iw*0.76:h=ih*0.16:color=white@0.06:t=fill`);

  // text overlays (guard: if empty, keep minimal)
  if (headline.trim()) {
    vfParts.push(
      `drawtext=text='${headline}'${fontArg}:x=(w-text_w)/2:y=${headlineY}:fontsize=${headlineSize}${common}:alpha='if(lt(t,0.6), t/0.6, 1)'`
    );
  }
  if (main.trim()) {
    vfParts.push(
      `drawtext=text='${main}'${fontArg}:x=(w-text_w)/2:y=${bodyY}:fontsize=${bodySize}${common}:fontcolor=white@0.90:alpha='if(lt(t,0.9), 0, if(lt(t,1.6),(t-0.9)/0.7,1))'`
    );
  }
  if (bulletsEsc.trim()) {
    vfParts.push(
      `drawtext=text='${bulletsEsc}'${fontArg}:x=w*0.10:y=${bulletsY}:fontsize=${bulletSize}${common}:fontcolor=white@0.85:alpha='if(lt(t,1.3), 0, if(lt(t,2.0),(t-1.3)/0.7,1))'`
    );
  }
  if (cta.trim()) {
    // CTA with a faux button (box + text)
    vfParts.push(`drawbox=x=w*0.20:y=${ctaY-20}:w=w*0.60:h=${ctaSize+44}:color=0x66e3ff@0.22:t=fill`);
    vfParts.push(`drawbox=x=w*0.20:y=${ctaY-20}:w=w*0.60:h=${ctaSize+44}:color=0x66e3ff@0.55:t=2`);
    vfParts.push(
      `drawtext=text='${cta}'${fontArg}:x=(w-text_w)/2:y=${ctaY}:fontsize=${ctaSize}${common}:alpha='if(lt(t,1.8), 0, if(lt(t,2.5),(t-1.8)/0.7,1))'`
    );
  }

  const vf = vfParts.join(",");

  const args = [
    "-y",
    "-f", "lavfi",
    "-i", `color=c=#0b0f17:s=${w}x${h}:r=30:d=${seconds}`,
    "-vf", vf,
    "-t", String(seconds),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outFile,
  ];

  const result = await new Promise<{ ok: boolean; error?: string }>((resolve) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", (e: any) => {
      if (e?.code === "ENOENT") {
        resolve({ ok: false, error: "ffmpeg non trovato. Installa ffmpeg e riprova." });
      } else {
        resolve({ ok: false, error: e?.message ?? "Errore ffmpeg" });
      }
    });
    p.on("close", async (code) => {
      if (code === 0) resolve({ ok: true });
      else resolve({ ok: false, error: `ffmpeg exit ${code}. Dettagli: ${stderr.slice(-500)}` });
    });
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Errore generazione video" }, { status: 500 });
  }

  return NextResponse.json({ url }, { status: 200 });
}
