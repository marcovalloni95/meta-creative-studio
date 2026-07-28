// Estrazione euristica dei punti d'attacco dal copy: servono a riempire
// l'overlay dell'archetipo e a pianificare le slide del carosello.

import type { AttackPoints } from "./types";

function deaccent(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function extractHeadline(copy: string): string {
  const firstLine = copy
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return "";
  const sentence = firstLine.split(/(?<=[.!?])\s/)[0];
  return (sentence || firstLine).trim();
}

function extractQuote(copy: string): string | undefined {
  const m =
    copy.match(/[«“]([^»”]{12,})[»”]/) ||
    copy.match(/"([^"]{12,})"/) ||
    copy.match(/'([^']{12,})'/);
  const q = m?.[1]?.trim();
  if (!q) return undefined;
  // conta solo se somiglia al parlato del cliente (lunga o in prima persona)
  const flat = deaccent(q);
  if (q.length >= 30 || /\b(mi|ho|sono|non mi|mia|mio|avevo|ero)\b/i.test(flat)) return q;
  return undefined;
}

function extractNumber(copy: string): string | undefined {
  const flat = deaccent(copy);
  const m = flat.match(
    /\b\d[\d.\s]*\s*(?:\+|%|mila|pazienti|clienti|recensioni|testimonianze|anni)\b/i
  );
  return m ? m[0].replace(/\s+/g, " ").trim() : undefined;
}

function firstSentenceMatching(copy: string, re: RegExp): string | undefined {
  const sentences = copy.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim());
  const hit = sentences.find((s) => s.length > 6 && re.test(deaccent(s)));
  return hit || undefined;
}

function lineMatching(copy: string, re: RegExp): string | undefined {
  const line = copy
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => re.test(deaccent(l)));
  return line || undefined;
}

const BENEFIT_RE =
  /\b(senza|finalmente|torna a|ritrova|di nuovo|in soli|risolv|elimin|riduc|miglior|percorso)\b/i;
const OBJECTION_RE =
  /\b(pensi che|credi che|ho gia provato|non funziona|troppo (caro|difficile)|dovrai operart|passa\b.{0,16}\bda sola|riposo e pazienza)\b/i;
const VOICE_RE = /\b(dott\.?|dottor|dottoressa|sono il fondatore|mi chiamo|dal (?:19|20)\d\d|fondatore)\b/i;
const CTA_RE =
  /\b(clicca|richiedi|prenota|scopri|scarica|acquista|compila|contatta|iscriviti|chiama|candidati)\b/i;
const OFFER_RE = /\b(sconto|offerta|promo|risparmia|prezzo|€\s*\d|\d+\s*€|\d+\s*%)/i;
const FIRST_PERSON_RE = /\b(mi avevano|non mi sono|ho risolto|grazie a|dopo (?:anni|mesi))\b/i;

export function extractAttackPoints(copy: string): AttackPoints {
  const quote = extractQuote(copy);
  const voiceLine = lineMatching(copy, VOICE_RE);
  const ctaLine = firstSentenceMatching(copy, CTA_RE);
  const offerLine = OFFER_RE.test(deaccent(copy)) ? firstSentenceMatching(copy, OFFER_RE) : undefined;
  return {
    headline: extractHeadline(copy),
    quote,
    proof: extractNumber(copy),
    benefit: firstSentenceMatching(copy, BENEFIT_RE),
    objection: firstSentenceMatching(copy, OBJECTION_RE),
    voice: voiceLine ?? (FIRST_PERSON_RE.test(deaccent(copy)) ? "voce in prima persona (cliente)" : undefined),
    cta: ctaLine,
    offer: offerLine,
  };
}

// Punteggio euristico di un archetipo sul copy (per l'auto-scelta nella famiglia).
export function scoreArchetypeTriggers(copy: string, triggers: RegExp[]): number {
  const flat = deaccent(copy);
  let score = 0;
  for (const re of triggers) if (re.test(flat) || re.test(copy)) score += 1;
  return score;
}
