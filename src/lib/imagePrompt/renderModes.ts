// src/lib/imagePrompt/renderModes.ts
// NUOVO FILE.
// Mappa ciascuno dei 24 archetipi al suo "render mode": come la creativita va
// materialmente prodotta. E' la distinzione che oggi manca nel motore e che
// causa il collasso di tutto su un unico output fotorealistico.
//
//  photo        -> scena reale generata da modello immagine (Gemini/Flux/ChatGPT)
//  typographic  -> nessuna scena: tinta piena + tipografia + eventuale bottone CTA.
//                  NON va a un modello immagine: va renderizzata (HTML/Canvas).
//  hybrid       -> foto di sfondo + elemento tipografico dominante sopra.
//                  Si genera la foto via prompt e si compone il testo come layer.

import type { Archetype } from "./types";

export type RenderMode = "photo" | "typographic" | "hybrid";

export const RENDER_MODES: Record<string, RenderMode> = {
  // Famiglia A — Messaggio & Hook
  "01": "typographic", // Big Statement  <- e' esattamente RF2
  "02": "typographic", // Listicle
  "03": "hybrid",      // Big Number (numero enorme su foto di supporto)
  "04": "hybrid",      // Domanda / Quiz

  // Famiglia B — Prova & Credibilita
  "05": "photo",       // Testimonianza
  "06": "typographic", // Screenshot recensione (e' una UI, non una foto)
  "07": "typographic", // As seen in / Press (fascia loghi)
  "08": "typographic", // Rating aggregato

  // Famiglia C — Prodotto & Dimostrazione
  "09": "photo",       // Product Hero
  "10": "hybrid",      // Feature Callout
  "11": "photo",       // Before / After
  "12": "hybrid",      // How it works
  "13": "photo",       // Cosa include / Bundle

  // Famiglia D — Confronto & Logica
  "14": "typographic", // Comparison / Noi vs Loro (tabella)
  "15": "typographic", // Mito vs Realta (due fasce di testo)
  "16": "typographic", // This or That

  // Famiglia E — Offerta & Conversione
  "17": "typographic", // Offerta / Promo
  "18": "typographic", // Garanzia / Risk reversal
  "19": "typographic", // Urgenza / Scarsita

  // Famiglia F — Native & Contesto
  "20": "hybrid",      // Advertorial (foto documentaristica + titolo)
  "21": "photo",       // Lifestyle
  "22": "typographic", // Meme / Relatable
  "23": "photo",       // Founder Note
  "24": "photo",       // Flat lay / Unboxing
};

export function renderModeOf(a: Archetype): RenderMode {
  return RENDER_MODES[a.code] ?? "photo";
}
