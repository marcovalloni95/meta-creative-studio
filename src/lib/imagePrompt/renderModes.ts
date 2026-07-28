// Mappa ciascuno dei 24 archetipi al suo "render mode": come la creatività va
// materialmente prodotta.
//
//  photo        -> scena reale generata da un modello immagine
//  typographic  -> nessuna scena: tinta piena + tipografia + eventuale CTA,
//                  renderizzata via HTML/Canvas (testo esatto, non un modello)
//  hybrid       -> foto di sfondo (senza testo) + layer tipografico sopra

import type { Archetype, RenderMode } from "./types";

export const RENDER_MODES: Record<string, RenderMode> = {
  // Famiglia A — Messaggio & Hook
  "01": "typographic", // Big Statement
  "02": "typographic", // Listicle
  "03": "hybrid", //      Big Number (numero enorme su foto di supporto)
  "04": "hybrid", //      Domanda / Quiz

  // Famiglia B — Prova & Credibilità
  "05": "photo", //       Testimonianza
  "06": "typographic", // Screenshot recensione (è una UI, non una foto)
  "07": "typographic", // As seen in / Press (fascia loghi)
  "08": "typographic", // Rating aggregato

  // Famiglia C — Prodotto & Dimostrazione
  "09": "photo", //       Product Hero
  "10": "hybrid", //      Feature Callout
  "11": "photo", //       Before / After
  "12": "hybrid", //      How it works
  "13": "photo", //       Cosa include / Bundle

  // Famiglia D — Confronto & Logica
  "14": "typographic", // Comparison / Noi vs Loro (tabella)
  "15": "typographic", // Mito vs Realtà (due fasce di testo)
  "16": "typographic", // This or That

  // Famiglia E — Offerta & Conversione
  "17": "typographic", // Offerta / Promo
  "18": "typographic", // Garanzia / Risk reversal
  "19": "typographic", // Urgenza / Scarsità

  // Famiglia F — Native & Contesto
  "20": "hybrid", //      Advertorial (foto documentaristica + titolo)
  "21": "photo", //       Lifestyle
  "22": "typographic", // Meme / Relatable
  "23": "photo", //       Founder Note
  "24": "photo", //       Flat lay / Unboxing
};

export function renderModeOf(a: Archetype): RenderMode {
  return RENDER_MODES[a.code] ?? "photo";
}
