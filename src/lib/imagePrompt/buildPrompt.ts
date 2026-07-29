// Dispatcher: dato l'archetipo, il suo SCHEMA seleziona il builder di prompt
// (schemas.ts). Genera il prompt immagine per formato, l'eventuale render
// tipografico esatto (TYPO/HYBRID) e la checklist di validazione.

import { extractOnImage } from "./extract";
import { buildSchemaPrompt } from "./schemas";
import { buildTypoSpec, paletteToTypo, specToHtml } from "./typography";
import { validate } from "./validate";
import { CTA_BY_GOAL } from "./types";
import type {
  Archetype, AttackPoints, FormatPrompt, Goal, Logo, Model, OnImageText,
  Palette, PromptFormat, PromptUnit, TypoOutput,
} from "./types";

// Stringa dominante per il render tipografico / anteprima, ricavata dall'onImage.
const OVERLAY_PRIORITY = [
  "headline", "numero", "domanda", "quote", "testo", "titolo", "offerta",
  "promessa", "limite", "mito", "frase", "top", "voto", "claim",
];
function overlayText(onImage: OnImageText): string {
  for (const k of OVERLAY_PRIORITY) {
    const v = (onImage[k] || "").trim();
    if (v && !v.startsWith("[")) return v;
  }
  const first = Object.values(onImage).find((v) => v && !v.trim().startsWith("["));
  return (first || "").trim();
}

// CTA a bottone nel render tipografico: solo dove ha senso.
const CTA_LABEL_BY_GOAL: Record<Goal, string> = {
  leads: "RICHIEDI ORA",
  sales: "ACQUISTA ORA",
  awareness: "SCOPRI DI PIÙ",
};
function ctaButton(a: Archetype, goal: Goal): string | undefined {
  if (["17", "18", "19", "01", "04", "08"].includes(a.code)) return CTA_LABEL_BY_GOAL[goal];
  return undefined;
}

export function buildUnit(
  a: Archetype, copy: string, points: AttackPoints, formats: PromptFormat[],
  model: Model, pal: Palette, goal: Goal, logo: Logo | undefined,
  role: string, slide?: number
): PromptUnit {
  const onImage = extractOnImage(a, copy, points, goal);
  const overlay = overlayText(onImage);
  const typo = paletteToTypo(pal);
  const ctaLabel = ctaButton(a, goal);

  const prompts: FormatPrompt[] = formats.map((f) => ({
    format: f,
    text: buildSchemaPrompt(a, f, model, pal, goal, logo, onImage),
    backgroundOnly: a.schema === "HYBRID" || undefined,
  }));

  // Render tipografico esatto (HTML->PNG) per gli schemi a testo pieno / layer.
  let typographic: TypoOutput[] | undefined;
  if ((a.schema === "TYPO" || a.schema === "HYBRID") && overlay) {
    typographic = formats.map((f) => {
      const spec = buildTypoSpec(f, overlay, typo, ctaLabel);
      return { format: f, spec, html: specToHtml(spec, typo.fontStack) };
    });
  }

  return {
    slide,
    role,
    archetype: a,
    schema: a.schema,
    onImage,
    overlay,
    prompts,
    typographic,
    checklist: validate(a, onImage, prompts),
  };
}

// Riesportata per retro-compatibilità (usata altrove per la CTA testuale).
export { CTA_BY_GOAL };
