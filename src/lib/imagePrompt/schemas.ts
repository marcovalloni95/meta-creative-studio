// I quattro schemi di prompt. Lo schema dell'archetipo seleziona il builder:
// PHOTO, TYPO, HYBRID, UI_MOCK producono prompt con CAMPI DIVERSI. È la modifica
// centrale del refactor: non più un template unico che tratta tutto come foto.

import { describeLayout } from "./archetypes";
import { BEST_PRACTICES, NEGATIVE_DEFAULTS, NEGATIVE_SHORT, ROLE } from "./guidelines";
import { CTA_BY_GOAL, FORMAT_SPECS } from "./types";
import type {
  Archetype, Goal, Logo, Model, OnImageText, Palette, PromptFormat, Schema,
} from "./types";

function paletteLine(p: Palette): string {
  const parts = [`text ${p.text}`, `CTA/accent ${p.cta}`, `background ${p.background}`];
  if (p.accent) parts.push(`secondary ${p.accent}`);
  return parts.join(", ");
}

function logoLine(logo: Logo | undefined, model: Model): string | null {
  if (!logo) return null;
  if (model === "midjourney")
    return `leave a small clear corner (inside the safe zone) for the brand logo "${logo.name}"`;
  return `place the attached brand logo ("${logo.name}") small in a corner, inside the safe zone, without covering the message`;
}

// Blocco delle stringhe da renderizzare: letterali, tra virgolette, una per riga
// (regola §6 non negoziabile per TYPO/HYBRID/UI_MOCK).
function literalBlock(onImage: OnImageText): string {
  const entries = Object.entries(onImage).filter(([, v]) => v && v.trim());
  if (!entries.length) return "";
  const lines = entries.map(([k, v]) => `  - ${k}: "${v}"`).join("\n");
  return `Exact text to render, verbatim (correct Italian spelling and accents):\n${lines}\nRender ONLY these exact strings. No other text, letters or numbers anywhere in the image.`;
}

// Cue correttivo: GPT Image tende al patinato/iper-illuminato.
function antiGlossy(model: Model): string {
  return model === "chatgpt"
    ? " Add corrective realism cues: subtle grain, natural non-uniform lighting, avoid the over-glossy AI look."
    : "";
}

function ctaLine(p: Palette, goal: Goal): string {
  return `CTA (Leva): a single button reading "${CTA_BY_GOAL[goal]}" in ${p.cta}, positioned as the ACC/cta zone in the layout.`;
}

type Ctx = {
  a: Archetype; format: PromptFormat; model: Model; pal: Palette;
  goal: Goal; logo: Logo | undefined; onImage: OnImageText;
};

// ---------- PHOTO ----------
function photo(c: Ctx): string[] {
  const claim = c.onImage.claim || c.onImage.nome;
  return [
    `Concept: ${c.a.visual}.`,
    `Subject & setting: a real, believable scene to photograph for "${c.a.name}"; ${c.a.do}`,
    `Framing & lens: product/subject-appropriate framing (e.g. 50mm still-life or macro for product, 35mm for lifestyle), eye-level unless the scene suggests otherwise.`,
    `Lighting: natural or soft studio light, directional, soft shadows; realistic depth of field.`,
    `Composition (layout): ${describeLayout(c.a.layoutSpec, c.format)}.`,
    `Color & grade: ${paletteLine(c.pal)}; cohesive, on-brand color grade.`,
    `Mood & realism: photorealistic, editorial, not stocky; reserve negative space for the minimal overlay.${antiGlossy(c.model)}`,
    claim && claim.trim()
      ? `Minimal overlay text (verbatim, nothing else): "${claim}".`
      : `No text overlay (image-led).`,
  ];
}

// ---------- TYPO ----------
function typo(c: Ctx): string[] {
  return [
    `This is a GRAPHIC POSTER, not a photograph — generate NO photographic subject.`,
    `Background treatment: solid brand color / clean tint or subtle geometric blocks (${c.pal.background}); no scene.`,
    `Layout & hierarchy: ${describeLayout(c.a.layoutSpec, c.format)}. One dominant string; the rest is subordinate.`,
    literalBlock(c.onImage),
    `Typography: bold condensed sans (or brand face), high contrast, tight spacing; ${c.a.do}`,
    `Accent graphics: ${c.pal.accent || c.pal.cta} for underlines/highlights/badges as per the ACC zones.`,
    ctaLine(c.pal, c.goal),
    `Colors: ${paletteLine(c.pal)}; high contrast text/background.`,
  ];
}

// ---------- HYBRID ----------
function hybrid(c: Ctx): string[] {
  return [
    `Photographic background (the model renders ONLY the scene, no text): ${c.a.visual}. Natural, on-brand, not stocky.${antiGlossy(c.model)}`,
    `Declared text zone (mandatory): reserve a clear, low-detail area for the typographic layer — ${describeLayout(c.a.layoutSpec, c.format)}. The text must NOT sit over the subject.`,
    `Typographic layer, composited over the reserved zone:`,
    literalBlock(c.onImage),
    ctaLine(c.pal, c.goal),
    `Colors: ${paletteLine(c.pal)}; high contrast between the text layer and the photo behind it.`,
  ];
}

// ---------- UI_MOCK ----------
function uiMock(c: Ctx): string[] {
  const iface =
    c.a.code === "06"
      ? "a realistic messaging/review UI (chat bubble, store review card, or social post) with avatar, star rating and timestamp"
      : "a real news-article / editorial page layout with masthead-style header, headline, byline and body columns";
  return [
    `This is a UI MOCKUP, not a photo: simulate ${iface}.`,
    `UI fidelity: realistic chrome and details; ${c.a.do} Keep a touch of natural imperfection so it looks authentic, not a perfect ad.`,
    `Layout: ${describeLayout(c.a.layoutSpec, c.format)}.`,
    literalBlock(c.onImage),
    ctaLine(c.pal, c.goal),
    `Colors: ${paletteLine(c.pal)}. Constraint: no real platform logos/trademarks (generic UI only).`,
  ];
}

const BUILDERS: Record<Schema, (c: Ctx) => string[]> = {
  PHOTO: photo, TYPO: typo, HYBRID: hybrid, UI_MOCK: uiMock,
};

// ---- Assemblaggio per modello ----
function assembleNatural(c: Ctx, body: string[]): string {
  const spec = FORMAT_SPECS[c.format];
  const lines = [
    `Role: ${ROLE}.`,
    `Task: create a static Meta ad creative, ${spec.label} (${spec.px}), archetype "${c.a.id} ${c.a.name}" (${c.a.angle}), schema ${c.a.schema}.`,
    ...body.filter(Boolean),
    `Format & safe zone: ${spec.safe}; main message legible at 200px wide; in image-led layouts keep text under ~20% of the surface.`,
  ];
  const logoL = logoLine(c.logo, c.model);
  if (logoL) lines.push(`Logo: ${logoL}.`);
  lines.push(`Goal: ${c.goal === "leads" ? "lead generation" : c.goal === "sales" ? "sales/conversion" : "brand awareness"}.`);
  lines.push(BEST_PRACTICES);
  lines.push(`Negative: ${NEGATIVE_DEFAULTS}${c.a.schema !== "PHOTO" ? ", no text other than the strings listed" : ""}. Avoid: ${c.a.dont}`);
  return lines.join("\n");
}

function assembleDescriptive(c: Ctx, body: string[]): string {
  const spec = FORMAT_SPECS[c.format];
  const kind =
    c.a.schema === "PHOTO"
      ? "photograph"
      : c.a.schema === "TYPO"
      ? "flat graphic poster, no photo"
      : c.a.schema === "UI_MOCK"
      ? "realistic UI mockup"
      : "photo background with a reserved text band";
  const literal = literalBlock(c.onImage);
  const base = [
    `${c.a.visual}, ${kind}`,
    `layout: ${describeLayout(c.a.layoutSpec, c.format)}`,
    `palette ${paletteLine(c.pal)}`,
    "high contrast, clear hierarchy, thumbnail-legible",
  ].join(", ");
  const tail = `${literal ? "\n" + literal : ""}\n${ctaLine(c.pal, c.goal)}`;
  if (c.model === "midjourney") {
    const no = c.a.schema === "PHOTO" ? NEGATIVE_SHORT : `${NEGATIVE_SHORT}, unlisted text`;
    return `${base} --ar ${c.format} --style raw --v 6 --no ${no}${tail}`;
  }
  return `${base}. Aspect ratio ${c.format} (${spec.px}), still image.${antiGlossy(c.model)}${tail}`;
}

export function buildSchemaPrompt(
  a: Archetype, format: PromptFormat, model: Model, pal: Palette,
  goal: Goal, logo: Logo | undefined, onImage: OnImageText
): string {
  const c: Ctx = { a, format, model, pal, goal, logo, onImage };
  const body = BUILDERS[a.schema](c);
  return model === "midjourney" || model === "higgsfield"
    ? assembleDescriptive(c, body)
    : assembleNatural(c, body);
}
