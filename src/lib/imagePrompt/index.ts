// Entry point del tool. generate() prende la richiesta strutturata (copy +
// parametri UI) e restituisce il/i prompt: una statica singola o N slide di
// carosello, ciascuna nei formati richiesti.

import { buildUnit } from "./buildPrompt";
import { pickArchetype, planCarousel } from "./classify";
import { extractAttackPoints } from "./extract";
import type { GenerateRequest, GenerateResult, PromptUnit } from "./types";

export * from "./types";
export { ARCHETYPES, archetypesByFamily, getArchetype } from "./archetypes";
export { MODEL_HINT, ROLE, BEST_PRACTICES, NEGATIVE_DEFAULTS } from "./guidelines";

export function generate(req: GenerateRequest): GenerateResult {
  const copy = req.copy ?? "";
  const formats = req.formats.length ? req.formats : ["1:1" as const];
  const points = extractAttackPoints(copy);
  const primary = pickArchetype(copy, req.family, req.archetypeCode);

  const units: PromptUnit[] = [];

  if (req.contentType === "carousel") {
    const slides = planCarousel(copy, primary, req.slides ?? 3, req.goal);
    slides.forEach((s, i) => {
      units.push(
        buildUnit(s.archetype, copy, points, formats, req.model, req.palette, req.goal, req.logo, s.role, i + 1)
      );
    });
  } else {
    units.push(
      buildUnit(primary, copy, points, formats, req.model, req.palette, req.goal, req.logo, "Statica")
    );
  }

  return { attackPoints: points, units, note: buildNote(req, units) };
}

function buildNote(req: GenerateRequest, units: PromptUnit[]): string {
  const fams = Array.from(new Set(units.map((u) => u.archetype.family))).sort();
  if (req.contentType === "carousel") {
    const covered = fams.join(", ");
    const base = `Carosello di ${units.length} slide · famiglie coperte: ${covered}.`;
    const missingE = !fams.includes("E")
      ? " Nessuna leva di conversione pura (Famiglia E): valuta di chiudere con offerta/garanzia/urgenza."
      : "";
    return base + missingE + ` Ogni concetto è declinato nei formati ${req.formats.join(", ")}.`;
  }
  return `Statica singola · Archetipo ${units[0].archetype.code} ${units[0].archetype.name} (Famiglia ${units[0].archetype.family}). Per un set efficace il Manuale consiglia di pescare da almeno 3 famiglie diverse e declinare tutti i formati.`;
}
