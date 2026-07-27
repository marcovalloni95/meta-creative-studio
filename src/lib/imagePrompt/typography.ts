// src/lib/imagePrompt/typography.ts
// NUOVO FILE.
// Per gli archetipi "typographic" non si scrive un prompt: si costruisce uno
// SPEC DI LAYOUT deterministico e il relativo HTML, che viene renderizzato in
// PNG (Canvas gia presente nel repo, oppure html-to-image / Playwright).
// Cosi il testo esce esatto al 100%, cosa che nessun modello di diffusione
// garantisce.

import type { PromptFormat, StyleProfile } from "./types";

// Profilo tipografico del cliente: si estrae dalla landing page insieme al
// resto dello StyleProfile. E' cio' che oggi manca del tutto.
export type TypoProfile = {
  bg: string;          // colore di fondo dominante (hex)
  ink: string;         // colore testo primario
  highlight: string;   // colore parola/riga di rottura (es. "MA...")
  ctaBg: string;       // fondo bottone CTA
  ctaInk: string;      // testo bottone CTA
  fontStack: string;   // display face, condensata e pesante
  transform: "uppercase" | "none";
};

export const TYPO_PROFILES: Record<string, TypoProfile> = {
  "rally-factor": {
    bg: "#E51A19",
    ink: "#000000",
    highlight: "#FFFFFF",
    ctaBg: "#4CAF3D",
    ctaInk: "#FFFFFF",
    fontStack: '"Anton", "Oswald", "Archivo Black", Impact, sans-serif',
    transform: "none",
  },
  generic: {
    bg: "#111111",
    ink: "#FFFFFF",
    highlight: "#FFD400",
    ctaBg: "#4CAF3D",
    ctaInk: "#FFFFFF",
    fontStack: '"Archivo Black", "Oswald", Impact, sans-serif',
    transform: "none",
  },
};

export function getTypoProfile(profileId: string): TypoProfile {
  return TYPO_PROFILES[profileId] ?? TYPO_PROFILES.generic;
}

// Lo spec: struttura dati pura, ispezionabile e modificabile a mano.
export type TypoSpec = {
  format: PromptFormat;
  width: number;
  height: number;
  bg: string;
  blocks: TypoBlock[];
  cta?: { label: string; bg: string; ink: string };
};

export type TypoBlock = {
  text: string;
  color: string;
  // peso relativo nella gerarchia: 1 = riga di rottura, 0.7 = corpo hook
  weight: number;
  align: "left" | "center";
};

const DIMS: Record<PromptFormat, { w: number; h: number }> = {
  "1:1": { w: 1080, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
};

// Divide l'overlay in "hook" + "riga di rottura" (il pattern RF2: testo lungo
// nero + parola di svolta bianca gigante). Se non c'e' rottura, blocco unico.
const BREAKERS = /\b(MA|PERO'|PERÒ|TRANNE|SOLO CHE|ATTENZIONE)\b\.{0,3}\s*$/i;

export function splitHook(overlay: string): { body: string; breaker?: string } {
  const m = overlay.match(BREAKERS);
  if (!m) return { body: overlay.trim() };
  return {
    body: overlay.slice(0, m.index).trim(),
    breaker: m[0].trim().replace(/\.*$/, "") + "...",
  };
}

export function buildTypoSpec(
  format: PromptFormat,
  overlay: string,
  typo: TypoProfile,
  ctaLabel?: string
): TypoSpec {
  const { w, h } = DIMS[format];
  const { body, breaker } = splitHook(overlay);

  const blocks: TypoBlock[] = [
    { text: body, color: typo.ink, weight: 0.7, align: "center" },
  ];
  if (breaker) {
    blocks.push({ text: breaker, color: typo.highlight, weight: 1, align: "center" });
  }

  return {
    format,
    width: w,
    height: h,
    bg: typo.bg,
    blocks,
    cta: ctaLabel
      ? { label: ctaLabel, bg: typo.ctaBg, ink: typo.ctaInk }
      : undefined,
  };
}

// HTML autoportante: si apre in browser e si esporta in PNG a dimensione reale
// (o si passa a Playwright/puppeteer per il render headless).
export function specToHtml(spec: TypoSpec, fontStack: string): string {
  const rows = spec.blocks
    .map(
      (b) =>
        `<div class="line" style="color:${b.color};font-size:${(
          b.weight * (spec.height / 8)
        ).toFixed(0)}px">${escapeHtml(b.text)}</div>`
    )
    .join("\n      ");

  const cta = spec.cta
    ? `<div class="cta" style="background:${spec.cta.bg};color:${spec.cta.ink}">${escapeHtml(
        spec.cta.label
      )} 🛒</div>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#222}
  .canvas{
    width:${spec.width}px;height:${spec.height}px;background:${spec.bg};
    display:flex;flex-direction:column;justify-content:center;align-items:center;
    padding:${Math.round(spec.width * 0.06)}px;gap:${Math.round(spec.height * 0.01)}px;
    font-family:${fontStack};
  }
  .line{line-height:0.92;text-align:center;letter-spacing:-0.02em;width:100%}
  .cta{
    margin-top:${Math.round(spec.height * 0.03)}px;
    font-size:${Math.round(spec.height * 0.045)}px;
    padding:${Math.round(spec.height * 0.018)}px ${Math.round(spec.width * 0.06)}px;
    border-radius:${Math.round(spec.width * 0.012)}px;
    font-family:system-ui,sans-serif;font-weight:800;letter-spacing:0.02em;
  }
</style></head>
<body><div class="canvas" id="canvas">
      ${rows}
      ${cta}
</div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

// Per gli archetipi "hybrid": il prompt immagine deve descrivere SOLO lo sfondo,
// senza chiedere al modello di scrivere testo. Il testo si compone dopo.
export function backgroundOnlyDirective(profile: StyleProfile): string {
  return `Photorealistic candid still, ${profile.moment}. IMPORTANT: render NO text, NO letters, NO numbers, NO logos, NO watermarks anywhere in the image — text will be composited later. Leave the central third visually calm and low-detail so overlay type stays readable. Negative: any text or typography, ${profile.negatives}.`;
}
