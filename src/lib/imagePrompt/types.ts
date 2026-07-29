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

// Etichetta CTA (la "Leva") in base allo scopo.
export const CTA_BY_GOAL: Record<Goal, string> = {
  leads: "Richiedi la consulenza gratuita",
  sales: "Acquista ora",
  awareness: "Scopri di più",
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

// Lo SCHEMA determina QUALE builder di prompt viene composto (campo chiave del
// refactor): schemi strutturalmente diversi, con campi diversi.
//  PHOTO    -> scena reale da fotografare
//  TYPO     -> poster grafico a sfondo pieno, nessuna fotografia
//  HYBRID   -> foto + strato tipografico, con zona dichiarata per il testo
//  UI_MOCK  -> mockup di interfaccia (recensione, chat, articolo)
export type Schema = "PHOTO" | "TYPO" | "HYBRID" | "UI_MOCK";

// Grammatica a 4 token con cui il Manuale costruisce tutti i wireframe.
export type LayoutToken = "IMG" | "TXT" | "ACC" | "BG";
export type LayoutArea =
  | "full"
  | "top"
  | "upper"
  | "center"
  | "lower"
  | "bottom"
  | "left"
  | "right"
  | "split-v"
  | "split-h";

export type LayoutZone = {
  token: LayoutToken;
  area: LayoutArea;
  weight: number; // peso relativo 0-100
  role: string; // es. "headline", "cta", "fondo pieno"
};

// Un archetipo del catalogo (registry: unica fonte di verità).
export type Archetype = {
  code: string; // "05"
  id: string; // "B05" (famiglia + code)
  name: string;
  family: Family;
  schema: Schema; // quale builder di prompt usare
  angle: string; // etichetta funzione/angolo (es. "PROVA SOCIALE")
  copyRequired: string; // cosa serve dal copy (dal Manuale)
  do: string; // best practice specifica (dal Manuale)
  dont: string; // errore da evitare (dal Manuale)
  visual: string; // indicazione visiva sintetica
  textDensity: "image-led" | "balanced" | "text-heavy"; // Leva A
  visualStyle: "native" | "designed"; // Leva B
  layoutSpec: LayoutZone[]; // wireframe a zone (riflowato per formato)
  triggers: RegExp[]; // per l'auto-suggerimento dell'archetipo nella famiglia
};

// Stringhe testuali da mettere ON-IMAGE, estratte dal copy per archetipo.
export type OnImageText = Record<string, string>;

// Esito di un controllo di validazione pre-output.
export type ChecklistItem = { label: string; ok: boolean };

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

// Profilo tipografico (colori + font) derivato dalla palette scelta.
export type TypoProfile = {
  bg: string;
  ink: string;
  highlight: string;
  ctaBg: string;
  ctaInk: string;
  fontStack: string;
};

export type TypoBlock = {
  text: string;
  color: string;
  weight: number; // 1 = riga di rottura, 0.7 = corpo hook
  align: "left" | "center";
};

// Spec di layout deterministico per una statica typographic.
export type TypoSpec = {
  format: PromptFormat;
  width: number;
  height: number;
  bg: string;
  blocks: TypoBlock[];
  cta?: { label: string; bg: string; ink: string };
};

// Output typographic per un formato: spec + HTML autoportante (esportabile in PNG).
export type TypoOutput = {
  format: PromptFormat;
  spec: TypoSpec;
  html: string;
};

// Un prompt immagine per un singolo formato.
export type FormatPrompt = {
  format: PromptFormat;
  text: string; // prompt pronto da copiare per il modello scelto
  backgroundOnly?: boolean; // true per gli hybrid: il modello genera solo lo sfondo
};

// Una "unità" generata: una statica singola o una slide del carosello.
export type PromptUnit = {
  slide?: number; // presente solo nei caroselli
  role: string; // es. "Hook", "Prova", "CTA"
  archetype: Archetype;
  schema: Schema;
  onImage: OnImageText; // stringhe testuali da mostrare a parte
  overlay: string; // stringa dominante (compat/anteprima)
  prompts: FormatPrompt[]; // prompt immagine, uno per formato
  typographic?: TypoOutput[]; // render tipografico esatto (TYPO/HYBRID/UI_MOCK)
  checklist: ChecklistItem[]; // esiti validazione pre-output
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
