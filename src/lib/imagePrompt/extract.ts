// Estrazione euristica dei punti d'attacco dal copy: servono a riempire
// l'overlay dell'archetipo e a pianificare le slide del carosello.

import { CTA_BY_GOAL } from "./types";
import type { Archetype, AttackPoints, Goal, OnImageText } from "./types";

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

function words(text: string, max: number): string {
  const w = text.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  if (w.length <= max) return w.join(" ").replace(/[.,;:]$/, "");
  return w.slice(0, max).join(" ").replace(/[.,;:]$/, "") + "…";
}

// Fino a `n` voci brevi dal copy (per listicle/bundle), escludendo l'headline.
function bullets(copy: string, headline: string, n: number): string[] {
  return copy
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4 && s !== headline)
    .slice(0, n)
    .map((s) => words(s, 6));
}

// Estrae le stringhe testuali da mettere ON-IMAGE, secondo lo schema JSON che
// l'archetipo richiede (copyRequired). Valori tra [] = da completare a mano.
export function extractOnImage(a: Archetype, copy: string, p: AttackPoints, goal: Goal): OnImageText {
  const h = p.headline || "";
  const cta = CTA_BY_GOAL[goal];
  switch (a.code) {
    case "01": return { headline: words(h, 9) };
    case "02": return { titolo: words(h, 6), voci: (bullets(copy, h, 5).join(" · ") || "[3–5 voci]") };
    case "03": return { numero: p.proof ?? "[numero]", contesto: words(h, 8) };
    case "04": return { domanda: h.includes("?") ? h : `${words(h, 9)}?`, opzioni: "[2–3 opzioni]" };
    case "05": return { quote: p.quote ?? words(h, 12), nome: "[Nome, ruolo]" };
    case "06": return { testo: p.quote ?? words(h, 14), username: "[@utente · ★★★★★]" };
    case "07": return { headline: words(h, 8), loghi: "[loghi testate]" };
    case "08": return { voto: "★★★★★ 4,9/5", recensioni: p.proof ?? "[N recensioni]" };
    case "09": return { nome: "[nome prodotto]", claim: words(h, 6) };
    case "10": return { feature: "[2–4 feature + beneficio]" };
    case "11": return { prima: "PRIMA", dopo: "DOPO", claim: p.benefit ? words(p.benefit, 8) : words(h, 8) };
    case "12": return { step: bullets(copy, h, 3).join(" → ") || "[3 step]" };
    case "13": return { componenti: "[lista componenti]", valore: "[valore totale]" };
    case "14": return { criteri: "[3–5 criteri]", cta };
    case "15": return { mito: words(p.objection ?? h, 10), realta: "[la realtà]" };
    case "16": return { opzioneA: "[opzione A]", opzioneB: "[opzione B]", cta };
    case "17": return { offerta: p.offer ? words(p.offer, 8) : words(h, 8), cta, codice: "[CODICE]" };
    case "18": return { promessa: "Soddisfatto o rimborsato", condizioni: "[condizioni / giorni]", cta };
    case "19": return { limite: p.offer ? words(p.offer, 8) : "[scadenza / posti]", cta };
    case "20": return { occhiello: "[occhiello]", titolo: words(h, 12), corpo: "[sommario]" };
    case "21": return { claim: p.benefit ? words(p.benefit, 6) : words(h, 6) };
    case "22": return { top: words(h, 6), bottom: "[bottom text]" };
    case "23": return { frase: p.voice && p.voice.length > 12 ? words(p.voice, 14) : words(h, 12), firma: "— [Nome], fondatore" };
    case "24": return { claim: "" };
    default: return { headline: words(h, 10) };
  }
}

// Punteggio euristico di un archetipo sul copy (per l'auto-scelta nella famiglia).
export function scoreArchetypeTriggers(copy: string, triggers: RegExp[]): number {
  const flat = deaccent(copy);
  let score = 0;
  for (const re of triggers) if (re.test(flat) || re.test(copy)) score += 1;
  return score;
}
