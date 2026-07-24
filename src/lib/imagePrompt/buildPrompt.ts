// Costruisce il testo del prompt per un archetipo, adattato al modello scelto
// (Nano Banana, ChatGPT, Midjourney, Higgsfield), al formato, alla palette,
// allo scopo e all'eventuale logo.

import { FORMAT_SPECS } from "./types";
import type {
  Archetype,
  AttackPoints,
  FormatPrompt,
  Goal,
  Logo,
  Model,
  Palette,
  PromptFormat,
  PromptUnit,
} from "./types";

function shorten(text: string, maxWords: number): string {
  const words = text.trim().replace(/\s+/g, " ").split(" ");
  if (words.length <= maxWords) return text.trim().replace(/[.,;:]$/, "");
  return words.slice(0, maxWords).join(" ").replace(/[.,;:]$/, "") + "…";
}

const CTA_BY_GOAL: Record<Goal, string> = {
  leads: "Richiedi la consulenza gratuita",
  sales: "Acquista ora",
  awareness: "Scopri di più",
};

// Testo overlay dominante per l'archetipo, riempito dai punti d'attacco.
export function deriveOverlay(a: Archetype, p: AttackPoints, goal: Goal): string {
  const h = p.headline || "";
  switch (a.code) {
    case "01": return shorten(h, 9);
    case "02": return `${shorten(h, 7)} — 3–5 punti`;
    case "03": return p.proof ?? shorten(h, 7);
    case "04": return h.includes("?") ? h : `${shorten(h, 9)}?`;
    case "05":
    case "06": return p.quote ?? shorten(h, 12);
    case "07": return `Come visto su — ${shorten(h, 8)}`;
    case "08": return p.proof ?? "★★★★★";
    case "09": return shorten(h, 6);
    case "10": return p.benefit ? shorten(p.benefit, 8) : shorten(h, 8);
    case "11": return "PRIMA / DOPO";
    case "12": return `Come funziona — ${shorten(h, 6)}`;
    case "13": return "Cosa include";
    case "14": return "Noi vs Loro";
    case "15": return `MITO — "${shorten(p.objection ?? h, 9)}" / REALTÀ — [completa]`;
    case "16": return shorten(h, 8);
    case "17": return p.offer ? shorten(p.offer, 8) : `${CTA_BY_GOAL[goal]}`;
    case "18": return "Soddisfatto o rimborsato";
    case "19": return p.offer ? shorten(p.offer, 8) : "Ultimi posti disponibili";
    case "20": return shorten(h, 12);
    case "21": return p.benefit ? shorten(p.benefit, 7) : shorten(h, 7);
    case "22": return shorten(h, 8);
    case "23": return p.voice ? shorten(p.voice, 12) : shorten(h, 10);
    case "24": return "";
    default: return shorten(h, 10);
  }
}

function paletteLine(pal: Palette): string {
  const parts = [
    `primary/text color ${pal.text}`,
    `CTA/accent color ${pal.cta}`,
    `background ${pal.background}`,
  ];
  if (pal.accent) parts.push(`secondary accent ${pal.accent}`);
  return parts.join(", ");
}

function logoLine(logo: Logo | undefined, model: Model): string | null {
  if (!logo) return null;
  if (model === "midjourney") {
    return `Leave a small clear area in a top or bottom corner (inside the safe zone) to add the brand logo "${logo.name}" in post.`;
  }
  return `Place the brand logo (provided as an attached image, "${logo.name}") small in a top or bottom corner, inside the safe zone, without covering the message.`;
}

function densityHint(a: Archetype): string {
  if (a.textDensity === "text-heavy") return "text-led composition (the words carry the ad)";
  if (a.textDensity === "image-led") return "image-led composition (minimal text, the visual carries it)";
  return "balanced text/image composition";
}

function styleHint(a: Archetype): string {
  return a.visualStyle === "native"
    ? "native, organic, non-advertising look (as if real feed content)"
    : "clean, designed, branded look";
}

// ---- NANO BANANA / CHATGPT: prompt in linguaggio naturale a blocchi ----
function buildNaturalPrompt(
  a: Archetype, format: PromptFormat, pal: Palette, goal: Goal,
  logo: Logo | undefined, overlay: string, model: Model
): string {
  const spec = FORMAT_SPECS[format];
  const lines: string[] = [];
  lines.push(
    `Create a static Meta ad creative, ${spec.label} (${spec.px}), archetype "${a.code} ${a.name}" (${a.angle}).`
  );
  lines.push(`Concept: ${a.visual}.`);
  lines.push(`Composition: ${densityHint(a)}; ${styleHint(a)}; clear visual hierarchy, one dominant element.`);
  if (overlay) {
    lines.push(
      `Text overlay — render this exact text, verbatim, correct Italian spelling and accents: "${overlay}". Required copy elements: ${a.copyRequired}.`
    );
  } else {
    lines.push(`Text overlay: minimal or none (${a.copyRequired}).`);
  }
  lines.push(`Colors: ${paletteLine(pal)}; high contrast between text and background.`);
  lines.push(`Layout: ${spec.safe}; readable as a thumbnail (main message legible at 200px wide).`);
  const logoL = logoLine(logo, model);
  if (logoL) lines.push(logoL);
  lines.push(`Goal: ${goal === "leads" ? "lead generation" : goal === "sales" ? "sales/conversion" : "brand awareness"} — action direction: "${CTA_BY_GOAL[goal]}".`);
  lines.push(
    `Constraints: photorealistic where people appear; no watermark; no invented logos; render text exactly as quoted; no misspelled Italian.`
  );
  return lines.join("\n");
}

// ---- MIDJOURNEY / HIGGSFIELD: descrittivo, conciso, con parametri ----
function buildDescriptivePrompt(
  a: Archetype, format: PromptFormat, pal: Palette, goal: Goal,
  logo: Logo | undefined, overlay: string, model: Model
): string {
  const descr: string[] = [];
  descr.push(a.visual);
  descr.push(densityHint(a));
  descr.push(styleHint(a));
  if (overlay) descr.push(`bold poster typography reading "${overlay}"`);
  descr.push(`color palette: ${pal.text} text, ${pal.cta} accents, ${pal.background} background`);
  descr.push("high contrast, clear visual hierarchy, thumbnail-legible");
  const logoL = logoLine(logo, model);
  if (logoL) descr.push("clear corner space for a brand logo");

  const base = descr.join(", ");
  if (model === "midjourney") {
    return `${base} --ar ${format} --style raw --v 6`;
  }
  // higgsfield: still image mode, cinematic
  return `${base}. Aspect ratio ${format} (${FORMAT_SPECS[format].px}), still image, cinematic lighting.${logoL ? " " + logoL : ""}`;
}

export function buildFormatPrompt(
  a: Archetype, format: PromptFormat, model: Model, pal: Palette,
  goal: Goal, logo: Logo | undefined, overlay: string
): FormatPrompt {
  const text =
    model === "midjourney" || model === "higgsfield"
      ? buildDescriptivePrompt(a, format, pal, goal, logo, overlay, model)
      : buildNaturalPrompt(a, format, pal, goal, logo, overlay, model);
  return { format, text };
}

export function buildUnit(
  a: Archetype, points: AttackPoints, formats: PromptFormat[], model: Model,
  pal: Palette, goal: Goal, logo: Logo | undefined,
  role: string, slide?: number
): PromptUnit {
  const overlay = deriveOverlay(a, points, goal);
  const prompts = formats.map((f) => buildFormatPrompt(a, f, model, pal, goal, logo, overlay));
  return { slide, role, archetype: a, overlay, prompts };
}
