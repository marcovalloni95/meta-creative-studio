// Assembla il prompt a 6 blocchi (Subject / Context / Photo Aesthetics /
// Text Overlay / Layout / Directive) per un archetipo, un profilo stile e un
// formato. Deriva anche il testo overlay dominante dai punti d'attacco.

import type {
  Archetype,
  AttackPoints,
  Creative,
  FormatPrompt,
  PromptFormat,
  Signals,
  StyleProfile,
} from "./types";

// Accorcia una frase per l'overlay (leggibilita a thumbnail): max ~12 parole.
function shorten(text: string, maxWords = 12): string {
  const words = text.trim().replace(/\s+/g, " ").split(" ");
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ").replace(/[,;:]$/, "") + "…";
}

// Deriva il testo overlay dominante in base all'archetipo.
export function deriveOverlay(
  archetype: Archetype,
  points: AttackPoints,
  signals: Signals
): string {
  switch (archetype.code) {
    case "05": // Testimonianza
      return points.quote ?? points.headline;
    case "03": // Statistica / Big Number
      return points.proof ? `${points.proof}` : points.headline;
    case "08": // Rating aggregato
      return points.proof ?? "★★★★★";
    case "15": // Mito vs Realta
      return `MITO — "${shorten(points.objection ?? points.headline)}"  /  REALTÀ — [completa]`;
    case "23": // Founder Note
      return signals.founderLine ? shorten(signals.founderLine, 14) : points.headline;
    case "18": // Garanzia
      return signals.guaranteeLine ? shorten(signals.guaranteeLine, 10) : "Garanzia";
    case "19": // Urgenza
      return signals.urgencyLine ? shorten(signals.urgencyLine, 10) : "Ultimi posti";
    case "17": // Offerta
      return signals.offerLine ? shorten(signals.offerLine, 10) : points.headline;
    case "04": // Domanda
      return points.headline;
    case "02": // Listicle
      return shorten(points.headline, 8);
    default: // 01 Big Statement e altri
      return shorten(points.headline, 12);
  }
}

function layoutFor(format: PromptFormat, archetype: Archetype): string {
  const isBigNumber = archetype.code === "03";
  const isSplit = archetype.code === "15" || archetype.code === "11" || archetype.code === "14";

  if (format === "1:1") {
    if (isBigNumber)
      return "square 1080x1080; giant number occupies the upper 45%, supporting photo/tint in the lower 55%; keep text away from the outer 8% margins";
    if (isSplit)
      return "square 1080x1080; two contrasted bands (top vs bottom), clear divider; each band ~50%; keep text away from the outer 8% margins";
    return "square 1080x1080; photo fills ~65% (lower), text band ~35% (top); one dominant line, badge secondary; keep text away from the outer 8% margins";
  }
  // 9:16
  if (isBigNumber)
    return "vertical 1080x1920; giant number in the central third, photo full-bleed behind; keep the top ~15% and bottom ~15% clear for Stories/Reels UI safe zones";
  if (isSplit)
    return "vertical 1080x1920; two stacked contrasted bands split around the center; keep the top ~15% and bottom ~15% clear for Stories/Reels UI safe zones";
  return "vertical 1080x1920; photo full-bleed background, dominant text stacked in the central third, badge/CTA just below; keep the top ~15% and bottom ~15% clear for Stories/Reels UI safe zones";
}

function overlayInstruction(
  archetype: Archetype,
  overlay: string,
  profile: StyleProfile
): string {
  const { text, cta, accent } = profile.palette;
  return `render this exact text (verbatim, correct Italian spelling and accents): "${overlay}". Role: ${archetype.overlayRole}. Typography: bold condensed sans, high contrast, one dominant element; main text in ${text}, badge/CTA in ${cta}, accents in ${accent}.`;
}

function directiveFor(profile: StyleProfile): string {
  return `Photorealistic candid still, ${profile.moment}. Render the overlay text exactly as quoted with correct Italian spelling and accents, no invented words. Negative: ${profile.negatives}.`;
}

export function buildFormatPrompt(
  format: PromptFormat,
  archetype: Archetype,
  overlay: string,
  profile: StyleProfile
): FormatPrompt {
  const subject = profile.subject;
  const context = profile.context;
  const photoAesthetics = `${profile.photoAesthetics}. Archetype cue: ${archetype.visual}.`;
  const textOverlay = overlayInstruction(archetype, overlay, profile);
  const layout = layoutFor(format, archetype);
  const directive = directiveFor(profile);

  const full = [
    `Subject: ${subject}.`,
    `Context: ${context}.`,
    `Photo Aesthetics: ${photoAesthetics}`,
    `Text Overlay: ${textOverlay}`,
    `Layout: ${layout}.`,
    `Directive: ${directive}`,
    `Aspect ratio: ${format}.`,
  ].join("\n");

  return { format, subject, context, photoAesthetics, textOverlay, layout, directive, full };
}

export function buildCreative(
  archetype: Archetype,
  reason: string,
  points: AttackPoints,
  signals: Signals,
  profile: StyleProfile,
  formats: PromptFormat[]
): Creative {
  const overlay = deriveOverlay(archetype, points, signals);
  const prompts = {} as Record<PromptFormat, FormatPrompt>;
  for (const f of formats) {
    prompts[f] = buildFormatPrompt(f, archetype, overlay, profile);
  }
  return { archetype, reason, overlay, prompts };
}
