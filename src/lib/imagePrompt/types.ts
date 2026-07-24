// Tipi del tool "Image Prompt Generator".
// Dato un copy + parametri scelti dall'utente (formato, famiglia, scopo,
// statica/carosello, modello, palette, logo) produce il/i prompt di
// generazione immagine. Solo immagini statiche (statica singola o carosello).

export type PromptFormat = "1:1" | "4:5" | "9:16";

export const FORMAT_SPECS: Record<
  PromptFormat,
  { px: string; label: string; placements: string; safe: string }
> = {
  "1:1": {
    px: "1080x1080",
    label: "Quadrato 1:1",
    placements: "Feed Facebook/Instagram, Esplora, marketplace",
    safe: "keep text and logo within the inner 90% (avoid the outer ~8% margins)",
  },
  "4:5": {
    px: "1080x1350",
    label: "Verticale 4:5",
    placements: "Feed (massima superficie verticale)",
    safe: "keep text and logo within the inner 90% (avoid the outer ~8% margins)",
  },
  "9:16": {
    px: "1080x1920",
    label: "Verticale 9:16",
    placements: "Stories, Reels, full-screen",
    safe: "keep the top ~250px and bottom ~340px clear (Stories/Reels UI safe zones); no text or CTA there",
  },
};

// Le 6 famiglie del Manuale delle Statiche.
export type Family = "A" | "B" | "C" | "D" | "E" | "F";

export const FAMILY_LABELS: Record<Family, string> = {
  A: "Messaggio & Hook",
  B: "Prova & Credibilità",
  C: "Prodotto & Dimostrazione",
  D: "Confronto & Logica",
  E: "Offerta & Conversione",
  F: "Native & Contesto",
};

// Descrizione sintetica di ogni famiglia (dal Manuale).
export const FAMILY_DESC: Record<Family, string> = {
  A: "Statiche guidate dalla parola: fermano lo scroll con un'idea, una frase, un numero.",
  B: "Statiche che spostano la fiducia: prova sociale e autorità.",
  C: "Statiche che mostrano la cosa: prodotto, come funziona, cosa cambia.",
  D: "Statiche che ragionano: confronto, obiezioni, scelta.",
  E: "Statiche da fondo funnel: offerta, garanzia, urgenza. Da usare con parsimonia.",
  F: "Statiche che non sembrano pubblicità: native, storytelling, lifestyle, meme.",
};

// Scopo della campagna: influenza CTA e tono.
export type Goal = "leads" | "sales" | "awareness";

export const GOAL_LABELS: Record<Goal, string> = {
  leads: "Acquisizione contatti",
  sales: "Acquisti",
  awareness: "Brand awareness",
};

// Modello di generazione immagine: cambia la formattazione del prompt.
export type Model = "nano-banana" | "chatgpt" | "midjourney" | "higgsfield";

export const MODEL_LABELS: Record<Model, string> = {
  "nano-banana": "Nano Banana (Gemini)",
  chatgpt: "ChatGPT (GPT Image)",
  midjourney: "Midjourney",
  higgsfield: "Higgsfield",
};

export type ContentType = "static" | "carousel";

// Palette con ruoli. Valori liberi (hex o nome colore).
export type Palette = {
  text: string;
  cta: string;
  background: string;
  accent?: string;
};

// Logo allegato (solo metadati lato client + eventuale dataURL per anteprima).
export type Logo = {
  name: string;
  dataUrl?: string;
};

// Un archetipo del catalogo.
export type Archetype = {
  code: string; // "05"
  name: string;
  family: Family;
  angle: string; // etichetta funzione/angolo (es. "PROVA SOCIALE")
  copyRequired: string; // cosa serve dal copy (dal Manuale)
  visual: string; // indicazione visiva sintetica
  textDensity: "image-led" | "balanced" | "text-heavy"; // Leva A
  visualStyle: "native" | "designed"; // Leva B
  triggers: RegExp[]; // per l'auto-suggerimento dell'archetipo nella famiglia
};

// Punti d'attacco estratti dal copy (per riempire l'overlay).
export type AttackPoints = {
  headline: string;
  quote?: string;
  proof?: string;
  benefit?: string;
  objection?: string;
  voice?: string;
  cta?: string;
  offer?: string;
};

// Un prompt per un singolo formato.
export type FormatPrompt = {
  format: PromptFormat;
  text: string; // prompt pronto da copiare per il modello scelto
};

// Una "unità" generata: una statica singola o una slide del carosello.
export type PromptUnit = {
  slide?: number; // presente solo nei caroselli
  role: string; // es. "Hook", "Prova", "CTA"
  archetype: Archetype;
  overlay: string; // testo overlay dominante
  prompts: FormatPrompt[]; // uno per formato richiesto
};

export type GenerateRequest = {
  copy: string;
  formats: PromptFormat[];
  family: Family;
  archetypeCode?: string; // opzionale: se assente, auto dal copy nella famiglia
  goal: Goal;
  contentType: ContentType;
  slides?: number; // solo carosello
  model: Model;
  palette: Palette;
  logo?: Logo;
};

export type GenerateResult = {
  attackPoints: AttackPoints;
  units: PromptUnit[];
  note: string;
};
