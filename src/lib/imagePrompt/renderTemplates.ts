// Renderer a TEMPLATE HTML/CSS per gli archetipi grafici (TYPO/UI_MOCK).
// Produce la grafica FINITA (testo esatto + layout reale), esportabile in PNG.
// È l'approccio deterministico giusto per creatività strutturate (comparison,
// offerta, timeline, rating…) che i modelli di diffusione sbagliano.
// Ritorna HTML autoportante (nessuna risorsa esterna) o null se non c'è template.

import type { OnImageText, Palette, PromptFormat } from "./types";

const DIMS: Record<PromptFormat, { w: number; h: number }> = {
  "1:1": { w: 1080, h: 1080 },
  "4:5": { w: 1080, h: 1350 },
  "9:16": { w: 1080, h: 1920 },
};

const DISPLAY = `"Archivo Black","Anton",Impact,system-ui,sans-serif`;
const BODY = `system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`;
const GREEN = "#22A45D";
const RED = "#E5484D";

function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

// Placeholder [..] → contenuto editabile; vuoto → fallback.
function val(oi: OnImageText, key: string, fallback = ""): string {
  const v = (oi[key] || "").trim();
  if (!v || v.startsWith("[")) return fallback;
  return v;
}

function frame(f: PromptFormat, bg: string, inner: string, extraCss = ""): string {
  const { w, h } = DIMS[f];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  .canvas{width:${w}px;height:${h}px;background:${bg};overflow:hidden;position:relative;
    font-family:${BODY};display:flex;flex-direction:column}
  .pad{padding:${Math.round(w * 0.07)}px;flex:1;display:flex;flex-direction:column;gap:${Math.round(h * 0.02)}px}
  .disp{font-family:${DISPLAY};line-height:0.95;letter-spacing:-0.01em}
  .up{text-transform:uppercase}
  ${extraCss}
  </style></head><body><div class="canvas">${inner}</div></body></html>`;
}

const scale = (f: PromptFormat) => DIMS[f].h / 1080; // per dimensionare i font

// ---------- A01 Big Statement ----------
function bigStatement(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const headline = esc(val(oi, "headline", "La tua frase più forte qui"));
  const cta = esc(val(oi, "cta", "Scopri di più"));
  const inner = `<div class="pad" style="justify-content:center;align-items:center;text-align:center">
    <div class="disp up" style="color:${p.text};font-size:${Math.round(96 * s)}px">${headline}</div>
    <div style="margin-top:${Math.round(60 * s)}px;background:${p.cta};color:#fff;font-weight:800;
      padding:${Math.round(24 * s)}px ${Math.round(48 * s)}px;border-radius:${Math.round(16 * s)}px;
      font-size:${Math.round(34 * s)}px" class="up">${cta}</div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- A02 Listicle / Timeline ----------
function listicle(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const titolo = esc(val(oi, "titolo", "3 motivi per sceglierci"));
  const raw = val(oi, "voci", "");
  const items = (raw ? raw.split("·").map((x) => x.trim()).filter(Boolean) : []);
  const rows = (items.length ? items : ["Primo punto chiave", "Secondo punto chiave", "Terzo punto chiave"]).slice(0, 5);
  const rowHtml = rows
    .map(
      (t, i) => `<div style="display:flex;align-items:center;gap:${Math.round(28 * s)}px;background:${p.text};
        border-radius:${Math.round(20 * s)}px;padding:${Math.round(26 * s)}px ${Math.round(30 * s)}px">
        <div class="disp" style="flex:0 0 auto;width:${Math.round(76 * s)}px;height:${Math.round(76 * s)}px;
          border-radius:50%;background:${p.cta};color:#fff;display:flex;align-items:center;justify-content:center;
          font-size:${Math.round(40 * s)}px">${i + 1}</div>
        <div style="color:#fff;font-weight:700;font-size:${Math.round(34 * s)}px">${esc(t)}</div>
      </div>`
    )
    .join("");
  const inner = `<div class="pad">
    <div class="disp up" style="color:${p.text};font-size:${Math.round(64 * s)}px;margin-bottom:${Math.round(14 * s)}px">${titolo}</div>
    <div style="display:flex;flex-direction:column;gap:${Math.round(22 * s)}px">${rowHtml}</div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- A03 Statistica / Big Number ----------
function bigNumber(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const numero = esc(val(oi, "numero", "94%"));
  const contesto = esc(val(oi, "contesto", "dei clienti lo consiglia"));
  const nfs = Math.round((numero.length > 6 ? 130 : numero.length > 4 ? 180 : 240) * s);
  const inner = `<div class="pad" style="justify-content:center;align-items:center;text-align:center">
    <div class="disp" style="color:${p.cta};font-size:${nfs}px;line-height:0.85">${numero}</div>
    <div style="color:${p.text};font-weight:700;font-size:${Math.round(40 * s)}px;margin-top:${Math.round(20 * s)}px;max-width:80%">${contesto}</div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- B08 Rating aggregato ----------
function rating(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const voto = esc(val(oi, "voto", "★★★★★ 4,9/5"));
  const rec = esc(val(oi, "recensioni", "oltre 1.200 recensioni"));
  const inner = `<div class="pad" style="justify-content:center;align-items:center;text-align:center">
    <div style="color:#F5A623;font-size:${Math.round(120 * s)}px;letter-spacing:8px">★★★★★</div>
    <div class="disp" style="color:${p.text};font-size:${Math.round(96 * s)}px;margin-top:${Math.round(10 * s)}px">${voto.replace(/★/g, "").trim() || "4,9/5"}</div>
    <div style="color:${p.text};opacity:.8;font-weight:600;font-size:${Math.round(36 * s)}px;margin-top:${Math.round(8 * s)}px">${rec}</div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- D15 Mito vs Realtà ----------
function mitoRealta(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const mito = esc(val(oi, "mito", "Il mito diffuso"));
  const realta = esc(val(oi, "realta", "La realtà oggettiva e la soluzione"));
  const inner = `<div style="flex:1;display:flex;flex-direction:column">
    <div style="flex:1;background:#2B2B2B;color:#fff;padding:${Math.round(70 * s)}px;display:flex;flex-direction:column;justify-content:center;gap:${Math.round(16 * s)}px">
      <div class="disp up" style="color:${RED};font-size:${Math.round(44 * s)}px">✗ Mito</div>
      <div style="font-weight:700;font-size:${Math.round(48 * s)}px">${mito}</div>
    </div>
    <div style="flex:1;background:${p.cta};color:#fff;padding:${Math.round(70 * s)}px;display:flex;flex-direction:column;justify-content:center;gap:${Math.round(16 * s)}px">
      <div class="disp up" style="font-size:${Math.round(44 * s)}px">✓ Realtà</div>
      <div style="font-weight:700;font-size:${Math.round(48 * s)}px">${realta}</div>
    </div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- D14 Comparison / Noi vs Loro ----------
function comparison(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const raw = val(oi, "criteri", "");
  const crit = (raw ? raw.split(/[·,;]/).map((x) => x.trim()).filter(Boolean) : []);
  const rows = (crit.length ? crit : ["Criterio 1", "Criterio 2", "Criterio 3", "Criterio 4"]).slice(0, 5);
  const rowHtml = rows
    .map(
      (t) => `<div style="display:flex;align-items:stretch;border-top:1px solid rgba(0,0,0,.08)">
        <div style="flex:1;padding:${Math.round(22 * s)}px;font-weight:700;color:${p.text};font-size:${Math.round(26 * s)}px;display:flex;align-items:center">${esc(t)}</div>
        <div style="flex:0 0 ${Math.round(130 * s)}px;display:flex;align-items:center;justify-content:center;background:rgba(34,164,93,.10);color:${GREEN};font-size:${Math.round(44 * s)}px">✓</div>
        <div style="flex:0 0 ${Math.round(130 * s)}px;display:flex;align-items:center;justify-content:center;background:rgba(229,72,77,.08);color:${RED};font-size:${Math.round(44 * s)}px">✗</div>
      </div>`
    )
    .join("");
  const inner = `<div class="pad">
    <div class="disp up" style="color:${p.text};font-size:${Math.round(56 * s)}px;text-align:center;margin-bottom:${Math.round(20 * s)}px">Noi vs Loro</div>
    <div style="background:#fff;border-radius:${Math.round(20 * s)}px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.10)">
      <div style="display:flex;background:${p.text};color:#fff">
        <div style="flex:1;padding:${Math.round(22 * s)}px;font-weight:800;font-size:${Math.round(28 * s)}px">Criterio</div>
        <div style="flex:0 0 ${Math.round(130 * s)}px;text-align:center;padding:${Math.round(22 * s)}px;font-weight:800;background:${p.cta};font-size:${Math.round(26 * s)}px">NOI</div>
        <div style="flex:0 0 ${Math.round(130 * s)}px;text-align:center;padding:${Math.round(22 * s)}px;font-weight:800;font-size:${Math.round(26 * s)}px">ALTRI</div>
      </div>
      ${rowHtml}
    </div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- E17 Offerta / Promo ----------
function offerta(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const off = esc(val(oi, "offerta", "-50%"));
  const offFs = Math.round((off.length > 8 ? 90 : off.length > 5 ? 140 : 200) * s);
  const codice = esc(val(oi, "codice", ""));
  const cta = esc(val(oi, "cta", "Approfitta ora"));
  const bullets = ["Spedizione gratuita", "Soddisfatti o rimborsati", "Solo per oggi"];
  const bl = bullets
    .map(
      (b) => `<div style="display:flex;align-items:center;gap:${Math.round(16 * s)}px;color:${p.text};font-weight:600;font-size:${Math.round(30 * s)}px">
      <span style="color:${GREEN};font-size:${Math.round(34 * s)}px">✓</span>${esc(b)}</div>`
    )
    .join("");
  const inner = `<div class="pad" style="align-items:center;text-align:center;justify-content:center">
    <div class="up" style="background:${RED};color:#fff;font-weight:800;padding:${Math.round(12 * s)}px ${Math.round(28 * s)}px;border-radius:999px;font-size:${Math.round(26 * s)}px">⏳ Offerta a tempo</div>
    <div class="disp" style="color:${p.cta};font-size:${offFs}px;line-height:0.9;margin-top:${Math.round(10 * s)}px">${off}</div>
    ${codice ? `<div style="border:2px dashed ${p.text};color:${p.text};font-weight:800;padding:${Math.round(12 * s)}px ${Math.round(26 * s)}px;border-radius:${Math.round(10 * s)}px;font-size:${Math.round(28 * s)}px" class="up">Codice: ${codice}</div>` : ""}
    <div style="display:flex;flex-direction:column;gap:${Math.round(12 * s)}px;margin-top:${Math.round(20 * s)}px;align-items:flex-start">${bl}</div>
    <div class="up" style="margin-top:${Math.round(24 * s)}px;background:${p.cta};color:#fff;font-weight:800;padding:${Math.round(24 * s)}px ${Math.round(56 * s)}px;border-radius:${Math.round(16 * s)}px;font-size:${Math.round(34 * s)}px">${cta}</div>
  </div>`;
  return frame(f, p.background, inner);
}

// ---------- E18 Garanzia / Risk reversal ----------
function garanzia(f: PromptFormat, oi: OnImageText, p: Palette): string {
  const s = scale(f);
  const promessa = esc(val(oi, "promessa", "Soddisfatto o rimborsato"));
  const cond = esc(val(oi, "condizioni", "entro 30 giorni"));
  const cta = esc(val(oi, "cta", "Provalo senza rischi"));
  const inner = `<div class="pad" style="align-items:center;text-align:center;justify-content:center;gap:${Math.round(26 * s)}px">
    <div class="disp" style="width:${Math.round(360 * s)}px;height:${Math.round(360 * s)}px;border-radius:50%;background:${p.cta};color:#fff;
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(6 * s)}px;box-shadow:0 12px 40px rgba(0,0,0,.15)">
      <div style="font-size:${Math.round(90 * s)}px">🛡️</div>
      <div class="up" style="font-size:${Math.round(30 * s)}px">Garanzia</div>
    </div>
    <div class="disp up" style="color:${p.text};font-size:${Math.round(56 * s)}px;max-width:85%">${promessa}</div>
    <div style="color:${p.text};opacity:.8;font-weight:600;font-size:${Math.round(32 * s)}px">${cond}</div>
    <div class="up" style="background:${p.cta};color:#fff;font-weight:800;padding:${Math.round(22 * s)}px ${Math.round(50 * s)}px;border-radius:${Math.round(16 * s)}px;font-size:${Math.round(32 * s)}px">${cta}</div>
  </div>`;
  return frame(f, p.background, inner);
}

const TEMPLATES: Record<string, (f: PromptFormat, oi: OnImageText, p: Palette) => string> = {
  "01": bigStatement,
  "02": listicle,
  "03": bigNumber,
  "08": rating,
  "14": comparison,
  "15": mitoRealta,
  "17": offerta,
  "18": garanzia,
};

export function hasTemplate(code: string): boolean {
  return code in TEMPLATES;
}

export function renderTemplate(
  code: string,
  format: PromptFormat,
  onImage: OnImageText,
  palette: Palette
): string | null {
  const fn = TEMPLATES[code];
  return fn ? fn(format, onImage, palette) : null;
}
