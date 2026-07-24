// Estrazione euristica dei segnali e dei punti d'attacco dal copy.
// Tutto deterministico e offline: nessuna chiamata esterna.

import type { AttackPoints, Signals } from "./types";

// Normalizza accenti per il matching (le regex del catalogo sono senza accenti).
function deaccent(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Prima frase forte: prima riga non vuota, ripulita, troncata a frase.
export function extractHeadline(copy: string): string {
  const firstLine = copy
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return "";
  // se la prima riga e molto lunga, prendi la prima frase
  const sentence = firstLine.split(/(?<=[.!?])\s/)[0];
  return (sentence || firstLine).trim();
}

// Testo tra virgolette (italiane, curve, guillemet).
export function extractQuote(copy: string): string | undefined {
  const m =
    copy.match(/[«“]([^»”]{12,})[»”]/) ||
    copy.match(/"([^"]{12,})"/) ||
    copy.match(/'([^']{12,})'/);
  const q = m?.[1]?.trim();
  return q || undefined;
}

// Numero di prova piu rilevante (con +, %, o unita tipiche).
export function extractNumber(copy: string): string | undefined {
  const flat = deaccent(copy);
  const m = flat.match(
    /\b\d[\d.\s]*\s*(?:\+|%|mila|pazienti|clienti|recensioni|testimonianze|anni)\b/i
  );
  if (!m) return undefined;
  return m[0].replace(/\s+/g, " ").trim();
}

const RE = {
  question: /\?\s*$/m,
  myth: /\b(mito|si dice|molti credono|falso[:!]|in realta|non e vero|pensi che|passa da sola)\b/i,
  founder: /\b(dott\.?|dottor|dottoressa|sono il fondatore|mi chiamo|dal (?:19|20)\d\d|fondatore)\b/i,
  guarantee: /\b(garanzia|garantit|soddisfatti o rimborsati|rimborso|senza rischi)\b/i,
  urgency: /\b(ultimi posti|posti limitati|solo (?:fino|per)|scade|entro il|affrettati|termina|ancora \d+ post)/i,
  offer: /\b(sconto|offerta|promo|risparmia|€\s*\d|\bgratis\b|gratuit)/i,
  comparison: /\b(vs\.?|contro|a differenza di|rispetto a|invece di|noi vs)\b/i,
  rating: /★|\bstelle\b|\b\d[.,]\d\s*(?:su|\/)\s*5\b|\b\d[\d.]*\s*(?:recensioni|valutazioni)\b/i,
  listicle: /(^|\n)\s*(?:\d+[.\)]|[-•])\s+/,
  firstPerson: /\b(mi avevano|non mi sono|ho risolto|grazie a|il mio|la mia|sono riuscit|dopo (?:anni|mesi))\b/i,
};

function lineMatching(copy: string, re: RegExp): string | undefined {
  const line = copy
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => re.test(deaccent(l)));
  return line || undefined;
}

export function extractSignals(copy: string): Signals {
  const flat = deaccent(copy);
  const quote = extractQuote(copy);
  return {
    hasQuote: !!quote,
    quote,
    number: extractNumber(copy),
    isQuestion: RE.question.test(copy),
    hasMyth: RE.myth.test(flat),
    hasFounder: RE.founder.test(flat),
    founderLine: RE.founder.test(flat) ? lineMatching(copy, RE.founder) : undefined,
    hasGuarantee: RE.guarantee.test(flat),
    guaranteeLine: RE.guarantee.test(flat) ? lineMatching(copy, RE.guarantee) : undefined,
    hasUrgency: RE.urgency.test(flat),
    urgencyLine: RE.urgency.test(flat) ? lineMatching(copy, RE.urgency) : undefined,
    hasOffer: RE.offer.test(flat),
    offerLine: RE.offer.test(flat) ? lineMatching(copy, RE.offer) : undefined,
    hasComparison: RE.comparison.test(flat),
    hasRating: RE.rating.test(flat),
    hasListicle: RE.listicle.test(copy),
    firstPerson: RE.firstPerson.test(flat),
    length: copy.trim().length,
  };
}

// Beneficio: prima frase che contiene un marker di beneficio, altrimenti undefined.
function extractBenefit(copy: string): string | undefined {
  const benefitRe =
    /\b(senza|finalmente|torna a|ritrova|di nuovo|in soli|risolv|elimin|riduc|miglior)\b/i;
  const sentences = copy.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim());
  const hit = sentences.find((s) => s.length > 8 && benefitRe.test(deaccent(s)));
  return hit || undefined;
}

// Obiezione: frase che segnala un dubbio comune.
function extractObjection(copy: string): string | undefined {
  const objRe =
    /\b(pensi che|credi che|forse pensi|ho gia provato|non funziona|troppo (?:caro|difficile)|dovrai operart|passa da sola)\b/i;
  const sentences = copy.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim());
  const hit = sentences.find((s) => objRe.test(deaccent(s)));
  return hit || undefined;
}

export function extractAttackPoints(copy: string, signals: Signals): AttackPoints {
  return {
    headline: extractHeadline(copy),
    quote: signals.quote,
    proof: signals.number,
    benefit: extractBenefit(copy),
    objection: extractObjection(copy),
    voice: signals.hasFounder ? signals.founderLine : signals.firstPerson ? "paziente/cliente (prima persona)" : undefined,
  };
}
