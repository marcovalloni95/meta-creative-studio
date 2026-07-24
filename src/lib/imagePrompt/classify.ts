// Classificatore deterministico: dai segnali del copy assegna uno o piu
// archetipi, con motivazione. Un copy lungo/ricco genera piu varianti su
// famiglie diverse (come da Manuale: coprire almeno 3 famiglie).

import { ARCHETYPES, getArchetype } from "./archetypes";
import type { Archetype, Signals } from "./types";

type Scored = { archetype: Archetype; score: number; reason: string };

// Copy oltre questa lunghezza e considerato "ricco": puo produrre piu
// STATICHE (varianti/archetipi) dallo stesso testo. L'output resta sempre
// e solo immagini statiche, mai video.
const LONG_COPY = 350;

// Punteggio minimo per considerare un archetipo un angolo "forte" e distinto.
const STRONG = 6;

export function scoreArchetypes(signals: Signals): Scored[] {
  const s = signals;
  const scores = new Map<string, { score: number; reason: string }>();

  const add = (code: string, score: number, reason: string) => {
    const cur = scores.get(code);
    if (!cur || score > cur.score) scores.set(code, { score, reason });
  };

  // Prova & credibilita (Famiglia B)
  if (s.hasQuote || s.firstPerson)
    add("05", s.hasQuote ? 9 : 7, "il copy e una testimonianza in prima persona con esito reale");
  if (s.hasRating) add("08", 6, "il copy porta rating/recensioni aggregate come prova");

  // Numero forte (Famiglia A)
  if (s.number) add("03", 8, `il copy ruota su un numero di prova (${s.number})`);

  // Confronto & logica (Famiglia D)
  if (s.hasMyth) add("15", 8, "il copy smonta una convinzione errata (mito vs realta)");
  if (s.hasComparison) add("14", 7, "il copy mette a confronto con le alternative");

  // Voce del founder (Famiglia F)
  if (s.hasFounder) add("23", 7, "il copy parla con la voce del founder/autorita");

  // Offerta & conversione (Famiglia E)
  if (s.hasUrgency) add("19", 8, "il copy leva su urgenza/scarsita reale");
  if (s.hasGuarantee) add("18", 8, "il copy offre una garanzia che abbatte il rischio");
  // hasOffer = promo vera (sconto/prezzo/%): la consulenza gratuita e la CTA
  // di ogni lead-gen, non attiva l'archetipo Offerta.
  if (s.hasOffer) add("17", 7, "il copy presenta un'offerta/promo concreta");

  // Messaggio & hook (Famiglia A)
  if (s.isQuestion) add("04", 6, "il copy apre con una domanda che qualifica il prospect");
  if (s.hasListicle) add("02", 5, "il copy elenca piu micro-benefici (listicle)");

  // Native & contesto (Famiglia F)
  // (advertorial/lifestyle sono fallback deboli)

  // Fallback: Big Statement, se nessun segnale forte.
  if (scores.size === 0) add("01", 3, "nessun segnale forte: affermazione dominante come hook puro");

  const out: Scored[] = [];
  for (const [code, v] of scores) {
    const a = getArchetype(code);
    if (a) out.push({ archetype: a, score: v.score, reason: v.reason });
  }
  // ordina per punteggio decrescente, poi per codice per stabilita
  out.sort((a, b) => b.score - a.score || a.archetype.code.localeCompare(b.archetype.code));
  return out;
}

// Sceglie gli archetipi finali. Copy corto -> 1 archetipo dominante.
// Copy lungo -> fino a maxVariants, privilegiando famiglie diverse.
export function pickArchetypes(
  signals: Signals,
  maxVariants: number
): Scored[] {
  const ranked = scoreArchetypes(signals);
  if (ranked.length === 0) {
    const a = ARCHETYPES[0];
    return [{ archetype: a, score: 1, reason: "fallback" }];
  }

  // "Ricco" = copy lungo OPPURE con >=2 angoli forti su famiglie diverse
  // (es. un copy con statistica + mito vs realta + founder note): da uno stesso
  // testo si ricavano piu STATICHE distinte, mai un video.
  const strongFamilies = new Set(
    ranked.filter((r) => r.score >= STRONG).map((r) => r.archetype.family)
  );
  const isRich = signals.length >= LONG_COPY || strongFamilies.size >= 2;
  const limit = isRich ? Math.max(1, maxVariants) : 1;

  const chosen: Scored[] = [];
  const usedFamilies = new Set<string>();

  // primo giro: massimizza la diversita di famiglia
  for (const cand of ranked) {
    if (chosen.length >= limit) break;
    if (usedFamilies.has(cand.archetype.family)) continue;
    chosen.push(cand);
    usedFamilies.add(cand.archetype.family);
  }
  // secondo giro: riempi eventuali slot residui (copy lungo con pochi segnali)
  for (const cand of ranked) {
    if (chosen.length >= limit) break;
    if (chosen.includes(cand)) continue;
    chosen.push(cand);
  }

  return chosen;
}
