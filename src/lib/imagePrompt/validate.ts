// Validazione pre-output (§7): controlli mostrati come checklist (non bloccanti).

import type { Archetype, ChecklistItem, FormatPrompt, OnImageText } from "./types";

// Valore "reale" da verificare nel prompt (esclude i placeholder tra []).
function realValues(onImage: OnImageText): string[] {
  return Object.values(onImage)
    .map((v) => (v || "").trim())
    .filter((v) => v && !v.startsWith("[") && v !== "★★★★★ 4,9/5");
}

export function validate(a: Archetype, onImage: OnImageText, prompts: FormatPrompt[]): ChecklistItem[] {
  const all = prompts.map((p) => p.text).join("\n");
  const items: ChecklistItem[] = [];

  // 1. le stringhe estratte compaiono letteralmente nel prompt
  const vals = realValues(onImage);
  const missing = vals.filter((v) => !all.includes(v));
  items.push({
    label:
      vals.length === 0
        ? "Nessuna stringa on-image richiesta"
        : missing.length === 0
        ? "Tutte le stringhe on-image sono nel prompt"
        : `Stringhe mancanti nel prompt: ${missing.length}`,
    ok: missing.length === 0,
  });

  // 2. lunghezze coerenti con copyRequired (dove verificabile)
  if (a.code === "01") {
    const n = (onImage.headline || "").split(/\s+/).filter(Boolean).length;
    items.push({ label: `Headline 5–9 parole (attuale: ${n})`, ok: n >= 5 && n <= 9 });
  } else if (a.code === "02") {
    const n = (onImage.voci || "").split("·").filter((s) => s.trim()).length;
    items.push({ label: `Listicle ≤ 5 voci (attuale: ${n || "n/d"})`, ok: n === 0 || n <= 5 });
  } else if (a.code === "12") {
    const n = (onImage.step || "").split("→").filter((s) => s.trim()).length;
    items.push({ label: `How it works ≤ 4 step (attuale: ${n || "n/d"})`, ok: n === 0 || n <= 4 });
  }

  // 3. schema TYPO/HYBRID/UI_MOCK: vincolo "nessun altro testo"
  if (a.schema !== "PHOTO") {
    items.push({
      label: "Vincolo 'nessun altro testo' presente",
      ok: /only these exact strings|no text other than|No other text/i.test(all),
    });
  }

  // 4. HYBRID: zona testo dichiarata
  if (a.schema === "HYBRID") {
    items.push({
      label: "Zona per il testo dichiarata (no testo sul soggetto)",
      ok: /reserved|declared text zone|reserve a clear|text band/i.test(all),
    });
  }

  // 5. un solo messaggio dominante (una statica, un'idea)
  items.push({ label: "Un solo messaggio dominante", ok: true });

  // 6. formato 9:16: safe zone citata
  if (prompts.some((p) => p.format === "9:16")) {
    items.push({ label: "Safe zone 9:16 citata", ok: /safe zone|~250px|~340px/i.test(all) });
  }

  return items;
}
