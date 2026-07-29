// Linee guida operative per la creazione di creatività (dal workshop
// "AI Creativa · Produci di più mantenendo la qualità" — 4ECOM / Loop Srl).
// Definiscono COME deve essere costruito il prompt e QUALE deve essere l'output.
// Sono applicate automaticamente dal generatore di prompt.

import type { Model } from "./types";

// Struttura di un prompt efficace (workshop, Sezione 2): Ruolo + Contesto +
// Task + Formato + Negative. Il generatore compone i blocchi in quest'ordine.
export const PROMPT_STRUCTURE = ["Role", "Context", "Task", "Format", "Negative"] as const;

// Ruolo di default per l'AI generativa (art director advertising e-commerce).
export const ROLE =
  "You are an art director specialized in performance / e-commerce advertising for Meta (Facebook & Instagram)";

// Best practice per le creative statiche (workshop, Sezione 4):
// - meno testo possibile (se una parola si può togliere, toglila);
// - una sola CTA (due CTA = zero CTA);
// - gerarchia visiva chiara, lettura alto-sinistra -> basso-destra;
// - coerenza di brand (font, colori, stile foto) su tutti i formati;
// - deve capirsi in 3 secondi ed essere leggibile a dimensione thumbnail (mobile).
export const BEST_PRACTICES =
  "Best practices: keep text to a minimum (if a word can be removed, remove it); one single, unmissable CTA; one dominant element with a clear hierarchy read top-left to bottom-right; brand consistency (font, colors, photo style) across every format; must be understood in 3 seconds and legible as a phone-sized thumbnail.";

// Negative di default (workshop, Sezione 2): dire sempre cosa NON vogliamo.
// Volutamente NON vieta lo sfondo neutro/pulito, richiesto da alcuni archetipi
// (es. Product Hero, still-life prodotto).
export const NEGATIVE_DEFAULTS =
  "no cartoon or illustration, no 3D/CGI or AI-glossy plastic look, no distorted or misspelled text, no watermark, no invented or competitor logos, more than one CTA, cluttered or busy composition, low resolution, deformed hands or faces, unrealistic proportions";

// Negative compatto per i modelli con parametro --no (Midjourney).
export const NEGATIVE_SHORT =
  "cartoon, illustration, 3d, cgi, plastic, distorted text, watermark, extra logos, clutter, low quality, deformed hands";

// Indicazione pratica su quale modello conviene usare (workshop, Sezione 4).
export const MODEL_HINT: Record<Model, string> = {
  "nano-banana":
    "Varianti rapide e A/B test: ideale per campagne Meta con molte creatività da testare.",
  chatgpt:
    "Brief dettagliati, prodotto + persona in contesto lifestyle; ottimo per la coerenza tra asset della stessa campagna.",
  midjourney:
    "Qualità artistica elevata, lifestyle e fashion; per contenuti dove l'estetica conta più della velocità. Testo nell'immagine debole: usa il render tipografico.",
  higgsfield:
    "Orientato a still cinematografici / editing; per una statica dagli un brief visivo forte. Testo nell'immagine debole: usa il render tipografico.",
};

// Da dove si parte per costruire il prompt (workshop, Sezione 4):
// asset foto-grafici caricati, una reference da riprodurre, oppure da zero.
export const START_POINT_NOTE =
  "If you attach product/reference images, tell the model to use them as reference (preserve product, proportions, brand details); otherwise the prompt builds the scene from scratch.";
