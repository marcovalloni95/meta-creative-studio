// Per gli archetipi "typographic" non si scrive un prompt per un modello
// immagine: si costruisce uno SPEC DI LAYOUT deterministico e il relativo HTML,
// che viene renderizzato in PNG (Canvas / html-to-image / Playwright). Così il
// testo esce esatto al 100%, cosa che nessun modello di diffusione garantisce.
//
// Adattato alla riprogettazione: i colori vengono dalla Palette scelta
// dall'utente, non da un profilo cliente fisso.

import type { Palette, PromptFormat, TypoBlock, TypoProfile, TypoSpec } from "./types";

const FONT_STACK = '"Archivo Black", "Anton", "Oswald", Impact, system-ui, sans-serif';

// Deriva il profilo tipografico dalla palette scelta.
export function paletteToTypo(pal: Palette): TypoProfile {
  return {
    bg: pal.background,
    ink: pal.text,
    highlight: pal.accent || pal.cta,
    ctaBg: pal.cta,
    ctaInk: "#FFFFFF",
    fontStack: FONT_STACK,
  };
}

const DIMS: Record<PromptFormat, { w: number; h: number }> = {
  "1:1": { w: 1080, h: 1080 },
  "4:5": { w: 1080, h: 1350 },
  "9:16": { w: 1080, h: 1920 },
};

// Divide l'overlay in "hook" + "riga di rottura" (testo lungo + parola di svolta
// gigante, es. "MA…"). Se non c'è rottura, blocco unico.
const BREAKERS = /\b(MA|PERO'|PERÒ|TRANNE|SOLO CHE|ATTENZIONE|REALTÀ|REALTA)\b\.{0,3}\s*$/i;

export function splitHook(overlay: string): { body: string; breaker?: string } {
  const m = overlay.match(BREAKERS);
  if (!m || m.index === undefined) return { body: overlay.trim() };
  return {
    body: overlay.slice(0, m.index).trim(),
    breaker: m[0].trim().replace(/\.*$/, "") + "…",
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
    cta: ctaLabel ? { label: ctaLabel, bg: typo.ctaBg, ink: typo.ctaInk } : undefined,
  };
}

// HTML autoportante (nessuna risorsa esterna): si apre in browser e si esporta
// in PNG a dimensione reale, o si passa a Playwright per il render headless.
export function specToHtml(spec: TypoSpec, fontStack: string): string {
  // scala la dimensione del testo in base al numero di blocchi, per non sforare
  const base = spec.height / (spec.blocks.length > 1 ? 9 : 7);
  const rows = spec.blocks
    .map(
      (b) =>
        `<div class="line" style="color:${b.color};font-size:${(b.weight * base).toFixed(
          0
        )}px">${escapeHtml(b.text)}</div>`
    )
    .join("\n      ");

  const cta = spec.cta
    ? `<div class="cta" style="background:${spec.cta.bg};color:${spec.cta.ink}">${escapeHtml(
        spec.cta.label
      )}</div>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${spec.width}px;height:${spec.height}px}
  .canvas{
    width:${spec.width}px;height:${spec.height}px;background:${spec.bg};
    display:flex;flex-direction:column;justify-content:center;align-items:center;
    padding:${Math.round(spec.width * 0.06)}px;gap:${Math.round(spec.height * 0.015)}px;
    font-family:${fontStack};text-transform:uppercase;
  }
  .line{line-height:0.92;text-align:center;letter-spacing:-0.02em;width:100%;word-break:break-word}
  .cta{
    margin-top:${Math.round(spec.height * 0.03)}px;
    font-size:${Math.round(spec.height * 0.04)}px;
    padding:${Math.round(spec.height * 0.018)}px ${Math.round(spec.width * 0.06)}px;
    border-radius:${Math.round(spec.width * 0.02)}px;
    font-family:system-ui,sans-serif;font-weight:800;letter-spacing:0.02em;text-transform:uppercase;
  }
</style></head>
<body><div class="canvas">
      ${rows}
      ${cta}
</div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}
