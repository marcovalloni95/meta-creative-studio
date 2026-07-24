// Tipi del tool "Image Prompt Generator" (deterministico, offline).
// Dato un copy Meta Ads + profilo stile cliente, produce prompt a blocchi
// per la creativita statica (foto + testo overlay) nei formati 1:1 e 9:16.

export type PromptFormat = "1:1" | "9:16";

// Le 6 famiglie del Manuale delle Statiche.
export type Family = "A" | "B" | "C" | "D" | "E" | "F";

export const FAMILY_LABELS: Record<Family, string> = {
  A: "Messaggio & Hook",
  B: "Prova & Credibilita",
  C: "Prodotto & Dimostrazione",
  D: "Confronto & Logica",
  E: "Offerta & Conversione",
  F: "Native & Contesto",
};

// Un archetipo del catalogo (22 archetipi, 6 famiglie).
export type Archetype = {
  code: string; // "05"
  name: string; // "Testimonianza"
  family: Family;
  // parole/segnali che nel copy attivano questo archetipo
  triggers: RegExp[];
  // come impostare l'overlay per questo archetipo
  overlayRole: string;
  // indicazione visiva sintetica (blocco Photo Aesthetics / Layout)
  visual: string;
};

// I 5 punti d'attacco estratti dal copy.
export type AttackPoints = {
  headline: string; // prima riga / prima frase forte
  quote?: string; // testo tra virgolette (testimonianza)
  proof?: string; // numero/percentuale/prova
  benefit?: string; // beneficio principale (best-effort)
  objection?: string; // obiezione tipica (best-effort)
  voice?: string; // voce narrante (founder/paziente) se rilevata
};

// Segnali booleani/valori rilevati euristicamente sul copy.
export type Signals = {
  hasQuote: boolean;
  quote?: string;
  number?: string; // il numero di prova piu rilevante
  isQuestion: boolean;
  hasMyth: boolean;
  hasFounder: boolean;
  founderLine?: string;
  hasGuarantee: boolean;
  guaranteeLine?: string;
  hasUrgency: boolean;
  urgencyLine?: string;
  hasOffer: boolean;
  offerLine?: string;
  hasComparison: boolean;
  hasRating: boolean;
  hasListicle: boolean;
  firstPerson: boolean;
  length: number;
};

// Profilo stile cliente (asset riusabile, estratto dalla landing).
export type StyleProfile = {
  id: string;
  name: string;
  // subject di default (eta/tipo persona) in inglese
  subject: string;
  // ambientazioni tipiche
  context: string;
  // blocco Photo Aesthetics riutilizzabile (inglese)
  photoAesthetics: string;
  // palette con ruoli: testo, cta/badge, accento
  palette: { text: string; cta: string; accent: string };
  // vincoli negativi (inglese)
  negatives: string;
  // momento narrativo preferito
  moment: string;
};

// Un prompt completo per un singolo formato.
export type FormatPrompt = {
  format: PromptFormat;
  subject: string;
  context: string;
  photoAesthetics: string;
  textOverlay: string;
  layout: string;
  directive: string;
  // stringa unica pronta da copiare/incollare in Gemini/ChatGPT
  full: string;
};

// Una creativita generata: archetipo + motivazione + prompt nei 2 formati.
export type Creative = {
  archetype: Archetype;
  reason: string;
  overlay: string; // testo overlay dominante
  prompts: Record<PromptFormat, FormatPrompt>;
};

// Output completo del generatore.
export type GenerateResult = {
  attackPoints: AttackPoints;
  signals: Signals;
  creatives: Creative[];
  // note sul set: famiglie coperte + eventuale mancanza Famiglia E
  setNote: string;
  familiesCovered: Family[];
};

export type GenerateOptions = {
  copy: string;
  profile: StyleProfile;
  // numero massimo di varianti da un copy lungo (default 3)
  maxVariants?: number;
  // formati richiesti (default entrambi)
  formats?: PromptFormat[];
};
