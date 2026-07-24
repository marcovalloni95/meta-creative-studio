// Scelta dell'archetipo nella famiglia indicata dall'utente e pianificazione
// del carosello (una slide = un angolo, distribuito su piu famiglie).

import { archetypesByFamily, getArchetype, ARCHETYPES } from "./archetypes";
import { scoreArchetypeTriggers } from "./extract";
import type { Archetype, Family, Goal } from "./types";

// Sceglie l'archetipo dentro la famiglia: se l'utente ne ha indicato uno preciso
// usa quello, altrimenti quello con piu segnali nel copy (fallback: il primo).
export function pickArchetype(copy: string, family: Family, code?: string): Archetype {
  if (code) {
    const a = getArchetype(code);
    if (a && a.family === family) return a;
    if (a) return a; // codice valido ma di altra famiglia: rispetta comunque la scelta
  }
  const fam = archetypesByFamily(family);
  let best = fam[0];
  let bestScore = -1;
  for (const a of fam) {
    const s = scoreArchetypeTriggers(copy, a.triggers);
    if (s > bestScore) {
      best = a;
      bestScore = s;
    }
  }
  return best;
}

// Miglior archetipo globale che soddisfa un predicato, per punteggio sul copy.
function bestMatching(copy: string, pred: (a: Archetype) => boolean): Archetype | undefined {
  let best: Archetype | undefined;
  let bestScore = -1;
  for (const a of ARCHETYPES) {
    if (!pred(a)) continue;
    const s = scoreArchetypeTriggers(copy, a.triggers);
    if (s > bestScore) {
      best = a;
      bestScore = s;
    }
  }
  return best;
}

// Archetipo di chiusura in base allo scopo della campagna.
function closingArchetype(copy: string, goal: Goal): { role: string; archetype: Archetype } {
  if (goal === "sales") {
    return { role: "Offerta / CTA", archetype: getArchetype("17")! };
  }
  if (goal === "leads") {
    // garanzia/risk-reversal abbassa la frizione della lead
    return { role: "Rassicurazione / CTA", archetype: getArchetype("18")! };
  }
  // awareness: chiusura morbida, native
  const soft = bestMatching(copy, (a) => a.code === "23" || a.code === "21") ?? getArchetype("21")!;
  return { role: "Chiusura brand", archetype: soft };
}

type Slide = { role: string; archetype: Archetype };

// Pianifica le slide del carosello: Hook (famiglia scelta) → angoli
// complementari su famiglie diverse → chiusura in base allo scopo.
export function planCarousel(
  copy: string,
  primary: Archetype,
  slides: number,
  goal: Goal
): Slide[] {
  const n = Math.max(2, Math.min(10, slides));
  const plan: Slide[] = [{ role: "Hook", archetype: primary }];
  const usedFamilies = new Set<Family>([primary.family]);
  const usedCodes = new Set<string>([primary.code]);

  const closing = closingArchetype(copy, goal);

  // Candidati per gli "ingredienti" del Manuale, in ordine di priorita.
  const candidates: { role: string; pick: () => Archetype | undefined }[] = [
    { role: "Prova", pick: () => bestMatching(copy, (a) => a.family === "B") },
    { role: "Dimostrazione", pick: () => bestMatching(copy, (a) => a.family === "C") },
    { role: "Obiezione / Confronto", pick: () => bestMatching(copy, (a) => a.family === "D") },
    { role: "Pain / Messaggio", pick: () => bestMatching(copy, (a) => a.family === "A") },
    { role: "Contesto", pick: () => bestMatching(copy, (a) => a.family === "F") },
  ];

  const middleSlots = n - 2; // -1 hook, -1 closing
  for (const cand of candidates) {
    if (plan.length - 1 >= middleSlots) break; // gia riempiti gli slot centrali
    const a = cand.pick();
    if (!a || usedCodes.has(a.code) || usedFamilies.has(a.family)) continue;
    plan.push({ role: cand.role, archetype: a });
    usedFamilies.add(a.family);
    usedCodes.add(a.code);
  }

  // Se restano slot centrali scoperti, riempi con altri archetipi non usati.
  for (const a of ARCHETYPES) {
    if (plan.length - 1 >= middleSlots) break;
    if (usedCodes.has(a.code) || a.code === closing.archetype.code) continue;
    plan.push({ role: "Angolo extra", archetype: a });
    usedCodes.add(a.code);
  }

  plan.push(closing);
  return plan.slice(0, n);
}
