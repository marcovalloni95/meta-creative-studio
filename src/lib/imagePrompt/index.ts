// Entry point del tool: generate() orchestra estrazione, classificazione e
// costruzione dei prompt. Tutto deterministico e offline.

import { buildCreative } from "./buildPrompt";
import { pickArchetypes } from "./classify";
import { extractAttackPoints, extractSignals } from "./extract";
import { FAMILY_LABELS } from "./types";
import type { Family, GenerateOptions, GenerateResult, PromptFormat } from "./types";

export * from "./types";
export { ARCHETYPES } from "./archetypes";
export { STYLE_PROFILES, getStyleProfile } from "./styleProfiles";

const DEFAULT_FORMATS: PromptFormat[] = ["1:1", "9:16"];

export function generate(opts: GenerateOptions): GenerateResult {
  const copy = opts.copy ?? "";
  const profile = opts.profile;
  const formats = opts.formats ?? DEFAULT_FORMATS;
  const maxVariants = opts.maxVariants ?? 3;

  const signals = extractSignals(copy);
  const points = extractAttackPoints(copy, signals);
  const chosen = pickArchetypes(signals, maxVariants);

  const creatives = chosen.map((c) =>
    buildCreative(c.archetype, c.reason, points, signals, profile, formats)
  );

  const familiesCovered = Array.from(
    new Set(creatives.map((c) => c.archetype.family))
  ).sort() as Family[];

  const setNote = buildSetNote(familiesCovered, creatives.length);

  return { attackPoints: points, signals, creatives, setNote, familiesCovered };
}

function buildSetNote(families: Family[], count: number): string {
  if (count <= 1) {
    return `Singola creativita (${families.map((f) => `${f} — ${FAMILY_LABELS[f]}`).join(", ")}). Per un set completo servono almeno 3 famiglie diverse: genera altre statiche da copy differenti.`;
  }
  const list = families.map((f) => `${f} (${FAMILY_LABELS[f]})`).join(", ");
  const parts: string[] = [];
  parts.push(`Famiglie coperte: ${list}.`);
  if (families.length >= 3) parts.push("Minimo di 3 famiglie raggiunto.");
  else parts.push("Il Manuale chiede almeno 3 famiglie diverse: aggiungi angoli su altre famiglie.");
  if (!families.includes("E"))
    parts.push("Manca la Famiglia E (Offerta/Garanzia/Urgenza): aggiungi una leva di conversione pura per chiudere il set.");
  return parts.join(" ");
}
