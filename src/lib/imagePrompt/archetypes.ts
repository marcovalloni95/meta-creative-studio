// Registry dei 24 archetipi (unica fonte di verità). Ogni entry porta lo SCHEMA
// (quale builder di prompt comporre), la layoutSpec a 4 token (IMG/TXT/ACC/BG),
// do/dont dal Manuale, le leve e i trigger per l'auto-scelta.

import type { Archetype, Family, LayoutZone } from "./types";

type Entry = Omit<Archetype, "id" | "elements">;

// Vocabolario grafico concreto per archetipo (icone, badge, colonne, pillole,
// spunte/croci, prezzi barrati, marcatori). Ispirato a creatività Meta reali:
// rende il prompt una creativita finita e ricca, non un poster minimale.
const ELEMENTS: Record<string, string> = {
  "01": "oversized display headline as the hero, one small icon/marker accent, flat brand-color background, bold keywords emphasized in the accent color",
  "02": "numbered rows inside rounded colored pills/cards, each with a small icon and a one-line label, bold keywords highlighted; a female/subject silhouette or thematic icon per row is common (infographic timeline style)",
  "03": "a giant number as the hero with a small unit/label, a thin one-line context beneath, an optional supporting icon, tiny source in micro type",
  "04": "a big question, an X or ? accent mark, 2-3 answer pills below with one highlighted in the accent color",
  "05": "real portrait, oversized quotation marks, the quote text, a name/role tag, a small 'cliente reale' badge and a row of stars",
  "06": "a realistic review/chat card with avatar, a 5-star row, timestamp and verified tick, subtle drop shadow, generic (non-branded) UI",
  "07": "a divider strip with a row of monochrome press/TV logos and a 'come visto su' label",
  "08": "five large gold stars, a big average score, a review-count line, an optional platform-style badge",
  "09": "a clean packshot with a soft shadow, product name, a tiny claim, abundant negative space",
  "10": "the product centered with 2-4 thin leader lines pointing to labeled feature chips with icons",
  "11": "a split with 'PRIMA' and 'DOPO' pills, a divider line/handle, a result claim ribbon",
  "12": "3 numbered circular badges with icons connected by a dotted line, short captions under each step",
  "13": "a knolled grid of the included items, a burst 'valore' badge, a checklist of what's included",
  "14": "two columns under a header bar, brand logos/mascots at the top of each, green check marks vs red crosses on every criterion row, a central circular 'VS' badge, a price row per column",
  "15": "two stacked panels: the top 'MITO' with an ✗ and an alert color, the bottom 'REALTÀ' with a ✓ on a brand-color block",
  "16": "two contrasting halves with icons and labels, a central pill or arrow, the 'right' side on the accent color",
  "17": "a huge discount/price as the hero, the old price struck through, an urgency badge ('EXPIRING SOON' / countdown pill), a checklist of benefits with ticks, optional small competitor price cards at the bottom",
  "18": "a circular guarantee seal/badge showing the number of days, a shield or lock icon, a short checklist of reassurances",
  "19": "a countdown timer or 'ultimi X posti' banner in an alert color, a clock or fire icon, a bold high-contrast CTA",
  "20": "a masthead-style header, a serif headline, a byline, body text in columns, an inline documentary photo, a discreet 'sponsored' cue",
  "21": "a full-bleed candid photo, a very short claim, a discreet logo, minimal text",
  "22": "a reaction photo/frame with bold Impact-style top and bottom captions with an outline, a relatable reference",
  "23": "a founder portrait, a handwritten-style open letter, a real signature, a small personal CTA",
  "24": "a top-down knolled composition of the product and contents under soft even light, an optional tiny price tag",
};

const A: Entry[] = [
  // ---- Famiglia A — Messaggio & Hook (text-heavy, look essenziale) ----
  {
    code: "01", name: "Big Statement", family: "A", schema: "TYPO", angle: "Hook · Curiosità",
    copyRequired: "L'headline più forte dell'ad, tagliata a 5–9 parole",
    do: "Una sola idea, tipografia enorme.", dont: "Tre messaggi insieme: ne resta zero.",
    visual: "una sola frase forte al centro, tipografia enorme, sfondo essenziale",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo pieno" },
      { token: "TXT", area: "center", weight: 70, role: "headline" },
      { token: "ACC", area: "top", weight: 15, role: "marcatore hook" },
    ],
    triggers: [/\b(mai|sempre|nessuno|tutti|smetti|basta|dimentica)\b/i],
  },
  {
    code: "02", name: "Listicle", family: "A", schema: "TYPO", angle: "Hook · Valore",
    copyRequired: "Titolo a contatore + 3–5 voci da una riga ciascuna",
    do: "Numeri grandi, voci scannabili.", dont: "Frasi lunghe: diventa un muro.",
    visual: "lista breve numerata, numeri grandi, voci scannabili",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "top", weight: 25, role: "titolo a contatore" },
      { token: "TXT", area: "center", weight: 55, role: "3–5 voci" },
      { token: "ACC", area: "left", weight: 20, role: "numeri" },
    ],
    triggers: [/(^|\n)\s*(\d+[.\)]|[-•])\s+/],
  },
  {
    code: "03", name: "Statistica / Big Number", family: "A", schema: "TYPO", angle: "Logica · Prova",
    copyRequired: "Il numero/percentuale chiave + una riga di contesto sotto",
    do: "Numero dominante, fonte piccola.", dont: "Dati non verificabili o gonfiati.",
    visual: "numero gigante dominante, fonte piccola",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "center", weight: 60, role: "numero dominante" },
      { token: "TXT", area: "lower", weight: 20, role: "riga di contesto" },
      { token: "TXT", area: "bottom", weight: 10, role: "fonte micro" },
    ],
    triggers: [/\b\d[\d. ]*\s*(\+|%|mila|pazienti|clienti|recensioni|anni)\b/i],
  },
  {
    code: "04", name: "Domanda / Quiz", family: "A", schema: "TYPO", angle: "Engagement",
    copyRequired: "La domanda diretta + 2–3 opzioni o un cliffhanger",
    do: "Domanda che identifica un target.", dont: "Domande retoriche vuote.",
    visual: "domanda diretta, tono conversazionale, opzioni a contrasto",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "upper", weight: 55, role: "domanda" },
      { token: "ACC", area: "bottom", weight: 30, role: "2–3 opzioni (una evidenziata)" },
    ],
    triggers: [/\?\s*$/m, /\b(sapevi|ti riconosci|quanti|quale di questi)\b/i],
  },

  // ---- Famiglia B — Prova & Credibilità ----
  {
    code: "05", name: "Testimonianza", family: "B", schema: "HYBRID", angle: "Prova sociale",
    copyRequired: "Quote del cliente (breve) + Nome/ruolo",
    do: "Virgolette, frase autentica.", dont: "Recensioni inventate o anonime generiche.",
    visual: "citazione del cliente in evidenza tra virgolette, volto reale",
    textDensity: "balanced", visualStyle: "native",
    layoutSpec: [
      { token: "IMG", area: "lower", weight: 60, role: "persona reale" },
      { token: "TXT", area: "upper", weight: 30, role: "quote" },
      { token: "ACC", area: "bottom", weight: 15, role: "nome/ruolo + badge" },
    ],
    triggers: [/[«“”»"].{12,}["»”«“]/, /\b(mi avevano|non mi sono|ho risolto|grazie a)\b/i],
  },
  {
    code: "06", name: "Screenshot recensione", family: "B", schema: "UI_MOCK", angle: "Prova · Native",
    copyRequired: "Testo del messaggio/recensione + Username o rating",
    do: "Look autentico dell'app reale.", dont: "Troppo perfetto: perde credibilità.",
    visual: "finge un contenuto reale: chat, tweet, recensione store, look autentico",
    textDensity: "text-heavy", visualStyle: "native",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo neutro" },
      { token: "IMG", area: "center", weight: 70, role: "mockup card recensione" },
      { token: "ACC", area: "center", weight: 15, role: "stelle + avatar + timestamp" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta bar" },
    ],
    triggers: [/\b(recensione|ha scritto|commento|chat)\b/i, /★/],
  },
  {
    code: "07", name: "As seen in / Press", family: "B", schema: "HYBRID", angle: "Autorità",
    copyRequired: "Headline di autorità + loghi/testate",
    do: "Loghi reali, allineati e puliti.", dont: "Loghi falsi o senza diritto d'uso.",
    visual: "loghi di testate o badge 'consigliato da', allineati e puliti",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "top", weight: 25, role: "headline di autorità" },
      { token: "ACC", area: "center", weight: 50, role: "striscia loghi testate" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta" },
    ],
    triggers: [/\b(come visto su|as seen in|intervistato|in tv|stampa|visti su)\b/i],
  },
  {
    code: "08", name: "Rating aggregato", family: "B", schema: "TYPO", angle: "Prova · Sintesi",
    copyRequired: "Voto medio + N° recensioni",
    do: "Numero recensioni se è alto.", dont: "Stelle senza un volume credibile.",
    visual: "stelle + numero di recensioni in evidenza",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "ACC", area: "top", weight: 30, role: "fila di stelle" },
      { token: "TXT", area: "center", weight: 35, role: "voto medio + n° recensioni" },
      { token: "ACC", area: "bottom", weight: 20, role: "cta" },
    ],
    triggers: [/\b\d[.,]\d\s*(su|\/)\s*5\b/i, /\b\d[\d.]*\s*(recensioni|valutazioni)\b/i],
  },

  // ---- Famiglia C — Prodotto & Dimostrazione (spesso image-led) ----
  {
    code: "09", name: "Product Hero", family: "C", schema: "PHOTO", angle: "Desiderio",
    copyRequired: "Nome prodotto + mini-claim opzionale",
    do: "Prodotto grande, sfondo che non distrae.", dont: "Packshot piccolo perso nello sfondo.",
    visual: "prodotto protagonista, pulito, ben illuminato, sfondo che non distrae",
    textDensity: "image-led", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "sfondo pulito/monocromo" },
      { token: "IMG", area: "center", weight: 75, role: "packshot prodotto" },
      { token: "TXT", area: "bottom", weight: 15, role: "nome + mini-claim" },
    ],
    triggers: [/\b(prodotto|dispositivo|kit|confezione)\b/i],
  },
  {
    code: "10", name: "Feature Callout", family: "C", schema: "HYBRID", angle: "Beneficio · Logica",
    copyRequired: "2–4 feature in una parola + beneficio per ciascuna",
    do: "Etichette ordinate, linee pulite.", dont: "Troppe frecce: diventa caotico.",
    visual: "prodotto centrale con etichette/linee guida sulle caratteristiche",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "IMG", area: "center", weight: 60, role: "prodotto" },
      { token: "ACC", area: "center", weight: 25, role: "linee guida/frecce" },
      { token: "TXT", area: "left", weight: 20, role: "etichette feature" },
      { token: "TXT", area: "right", weight: 20, role: "etichette feature" },
    ],
    triggers: [/\b(caratteristica|funzione|dotato di|tecnologia)\b/i],
  },
  {
    code: "11", name: "Before / After", family: "C", schema: "HYBRID", angle: "Pain · Trasformazione",
    copyRequired: "Etichetta Prima/Dopo + claim del risultato",
    do: "Stessa inquadratura, cambio chiaro.", dont: "Promesse irrealistiche o vietate.",
    visual: "split prima/dopo, stessa inquadratura, cambio chiaro",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "IMG", area: "split-v", weight: 80, role: "prima | dopo" },
      { token: "TXT", area: "top", weight: 15, role: "etichette Prima/Dopo" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta ponte" },
    ],
    triggers: [/\b(prima|dopo|before|after|trasformazione)\b/i],
  },
  {
    code: "12", name: "How it works / Step", family: "C", schema: "HYBRID", angle: "Come funziona · Logica",
    copyRequired: "3 step in poche parole + eventuale icona per step",
    do: "Sequenza chiara, sinistra→destra.", dont: "Più di 3–4 step in una statica.",
    visual: "processo in 3 passi numerati, sequenza sinistra→destra",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "IMG", area: "upper", weight: 50, role: "3 step con icone" },
      { token: "TXT", area: "center", weight: 30, role: "testo step" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta (ultimo step)" },
    ],
    triggers: [/\b(come funziona|in \d+ (step|passi|passaggi)|passo dopo passo)\b/i],
  },
  {
    code: "13", name: "Cosa include / Bundle", family: "C", schema: "HYBRID", angle: "Valore percepito",
    copyRequired: "Lista dei componenti + valore totale opzionale",
    do: "Far percepire 'tanto per il prezzo'.", dont: "Affollare senza gerarchia.",
    visual: "elementi inclusi disposti a vista (knolling), gerarchia chiara",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "IMG", area: "center", weight: 70, role: "griglia componenti (knolling)" },
      { token: "ACC", area: "top", weight: 15, role: "valore totale" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta" },
    ],
    triggers: [/\b(cosa include|incluso nel|bundle|in omaggio)\b/i],
  },

  // ---- Famiglia D — Confronto & Logica (razionale, spesso tabellare) ----
  {
    code: "14", name: "Comparison / Noi vs Loro", family: "D", schema: "TYPO", angle: "Differenziazione",
    copyRequired: "3–5 criteri + spunte vs croci",
    do: "Tu vinci su criteri che contano.", dont: "Citare competitor per nome se rischioso.",
    visual: "tabella a colonne, ✓ vs ✗, colonna nostra favorita",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "top", weight: 20, role: "header a barra piena" },
      { token: "TXT", area: "split-v", weight: 60, role: "due colonne criteri" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta alla base della colonna nostra" },
    ],
    triggers: [/\b(vs\.?|contro|a differenza di|rispetto a|invece di)\b/i],
  },
  {
    code: "15", name: "Mito vs Realtà", family: "D", schema: "TYPO", angle: "Obiezione",
    copyRequired: "Il mito (riga 1) + la realtà (riga 2)",
    do: "Mito riconoscibile, smentita netta.", dont: "Mito troppo di nicchia o astratto.",
    visual: "due blocchi impilati: Mito (allerta) vs Realtà (brand)",
    textDensity: "text-heavy", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "split-h", weight: 100, role: "split orizzontale" },
      { token: "TXT", area: "upper", weight: 45, role: "mito (colore allerta)" },
      { token: "TXT", area: "lower", weight: 45, role: "realtà (colore brand)" },
      { token: "ACC", area: "bottom", weight: 15, role: "cta nella realtà" },
    ],
    triggers: [/\b(mito|si dice|molti credono|ti raccontano|in realta|non e vero|(?:non )?passa\b.{0,16}\bda sola|riposo e pazienza)\b/i],
  },
  {
    code: "16", name: "This or That", family: "D", schema: "HYBRID", angle: "Identificazione",
    copyRequired: "Le 2 opzioni + la spinta verso la scelta giusta",
    do: "Contrasto netto tra i due lati.", dont: "Opzioni quasi identiche tra loro.",
    visual: "split verticale in due opzioni, perno centrale che risolve",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "IMG", area: "split-v", weight: 80, role: "due opzioni a contrasto" },
      { token: "ACC", area: "center", weight: 20, role: "cta perno centrale" },
    ],
    triggers: [/\b(questo o quello|this or that|scegli tra|sei piu)\b/i],
  },

  // ---- Famiglia E — Offerta & Conversione (fondo funnel) ----
  {
    code: "17", name: "Offerta / Promo", family: "E", schema: "TYPO", angle: "Incentivo",
    copyRequired: "L'offerta esatta + CTA + eventuale codice",
    do: "Vantaggio leggibile in un colpo.", dont: "Sconti perenni: perdono forza.",
    visual: "offerta/sconto come messaggio centrale dominante",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "TXT", area: "center", weight: 60, role: "offerta dominante" },
      { token: "ACC", area: "lower", weight: 20, role: "codice coupon" },
      { token: "ACC", area: "bottom", weight: 20, role: "cta transazionale" },
    ],
    triggers: [/\b(sconto|offerta|promo|risparmia|prezzo|€\s*\d|\d+\s*%)/i],
  },
  {
    code: "18", name: "Garanzia / Risk reversal", family: "E", schema: "TYPO", angle: "Rassicurazione",
    copyRequired: "La promessa di garanzia + condizioni in breve",
    do: "Badge + numero giorni chiari.", dont: "Condizioni nascoste o ambigue.",
    visual: "badge/sigillo di garanzia + condizioni brevi",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo" },
      { token: "ACC", area: "center", weight: 55, role: "badge/sigillo garanzia" },
      { token: "TXT", area: "lower", weight: 25, role: "promessa + condizioni" },
      { token: "ACC", area: "bottom", weight: 20, role: "cta accanto al sigillo" },
    ],
    triggers: [/\b(garanzia|garantit|soddisfatti o rimborsati|rimborso|senza rischi)\b/i],
  },
  {
    code: "19", name: "Urgenza / Scarsità", family: "E", schema: "TYPO", angle: "Spinta",
    copyRequired: "Il limite (tempo/quantità) + CTA immediata",
    do: "Urgenza reale e verificabile.", dont: "False scadenze ripetute.",
    visual: "countdown/limite ad alto impatto cromatico + cta immediata",
    textDensity: "balanced", visualStyle: "designed",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo allerta" },
      { token: "ACC", area: "top", weight: 30, role: "countdown/limite" },
      { token: "TXT", area: "center", weight: 35, role: "il limite" },
      { token: "ACC", area: "bottom", weight: 30, role: "cta immediata" },
    ],
    triggers: [/\b(ultimi posti|posti limitati|solo (fino|per)|scade|entro il|affrettati|ancora \d+ post)/i],
  },

  // ---- Famiglia F — Native & Contesto ----
  {
    code: "20", name: "Advertorial / Editoriale", family: "F", schema: "UI_MOCK", angle: "Native · Storytelling",
    copyRequired: "Titolo in stile testata + sommario/occhiello",
    do: "Tono giornalistico credibile.", dont: "Mascherare informazioni ingannevoli.",
    visual: "impaginato come un articolo di testata, tono giornalistico",
    textDensity: "text-heavy", visualStyle: "native",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "look articolo" },
      { token: "ACC", area: "top", weight: 10, role: "occhiello colorato" },
      { token: "TXT", area: "upper", weight: 20, role: "titolo stile testata" },
      { token: "IMG", area: "center", weight: 40, role: "foto documentaristica" },
      { token: "TXT", area: "lower", weight: 25, role: "corpo articolo" },
      { token: "ACC", area: "bottom", weight: 5, role: "cta inline" },
    ],
    triggers: [/\b(articolo|editoriale|storia di|abbiamo scoperto)\b/i],
  },
  {
    code: "21", name: "Lifestyle / Aspirazionale", family: "F", schema: "PHOTO", angle: "Emotivo · Contesto",
    copyRequired: "Claim emotivo breve + logo discreto",
    do: "Persona reale, contesto credibile.", dont: "Stock photo evidente e fredda.",
    visual: "scena lifestyle reale, soggetti in azione, testo minimo",
    textDensity: "image-led", visualStyle: "native",
    layoutSpec: [
      { token: "IMG", area: "full", weight: 100, role: "scena lifestyle full-bleed" },
      { token: "TXT", area: "bottom", weight: 15, role: "claim emotivo breve" },
      { token: "ACC", area: "bottom", weight: 8, role: "logo discreto / cta soft" },
    ],
    triggers: [/\b(finalmente|torna a|immagina di|goditi|di nuovo)\b/i],
  },
  {
    code: "22", name: "Meme / Relatable", family: "F", schema: "HYBRID", angle: "Emotivo · Viralità",
    copyRequired: "Top/bottom text + riferimento riconoscibile",
    do: "Far ridere chi è nel target.", dont: "Meme datati o fuori brand voice.",
    visual: "reaction image con top/bottom text, formato meme",
    textDensity: "text-heavy", visualStyle: "native",
    layoutSpec: [
      { token: "IMG", area: "center", weight: 70, role: "reaction image / frame" },
      { token: "TXT", area: "top", weight: 15, role: "top text" },
      { token: "TXT", area: "bottom", weight: 15, role: "bottom text" },
    ],
    triggers: [/\b(quando|pov|nessuno:|io:|relatable)\b/i],
  },
  {
    code: "23", name: "Founder Note", family: "F", schema: "HYBRID", angle: "Fiducia · Personale",
    copyRequired: "Frase personale + firma/foto founder",
    do: "Voce autentica, prima persona.", dont: "Tono corporate e impersonale.",
    visual: "messaggio in prima persona, stile lettera, firma/foto founder",
    textDensity: "balanced", visualStyle: "native",
    layoutSpec: [
      { token: "BG", area: "full", weight: 100, role: "fondo lettera" },
      { token: "IMG", area: "top", weight: 25, role: "foto founder" },
      { token: "TXT", area: "center", weight: 55, role: "lettera in prima persona" },
      { token: "ACC", area: "bottom", weight: 20, role: "firma + cta personale" },
    ],
    triggers: [/\b(dott\.?|dottor|dottoressa|sono il fondatore|mi chiamo|dal (19|20)\d\d|fondatore)\b/i],
  },
  {
    code: "24", name: "Flat lay / Unboxing", family: "F", schema: "PHOTO", angle: "Desiderio · Tattile",
    copyRequired: "Eventuale claim (niente o pochissimo testo)",
    do: "Composizione ordinata, luce piena.", dont: "Disordine che confonde la lettura.",
    visual: "flat lay zenitale, contenuti disposti in geometria precisa, luce diffusa",
    textDensity: "image-led", visualStyle: "native",
    layoutSpec: [
      { token: "IMG", area: "full", weight: 100, role: "flat lay zenitale" },
      { token: "ACC", area: "bottom", weight: 10, role: "cartellino/cta minimale" },
    ],
    triggers: [/\b(unboxing|flat lay|cosa trovi dentro|apri la (scatola|confezione))\b/i],
  },
];

export const ARCHETYPES: Archetype[] = A.map((e) => ({
  ...e,
  id: `${e.family}${e.code}`,
  elements: ELEMENTS[e.code] ?? e.visual,
}));

export function getArchetype(code: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.code === code || a.id === code);
}

export function archetypesByFamily(family: Family): Archetype[] {
  return ARCHETYPES.filter((a) => a.family === family);
}

// Riflow della layoutSpec in descrizione posizionale esplicita, per formato.
export function describeLayout(spec: LayoutZone[], format: "1:1" | "4:5" | "9:16"): string {
  const vertical = format === "9:16" || format === "4:5";
  const areaPhrase = (area: string): string => {
    if (!vertical) {
      switch (area) {
        case "full": return "full frame";
        case "top": return "top band";
        case "upper": return "upper half";
        case "center": return "centered, middle of the frame";
        case "lower": return "lower-central area";
        case "bottom": return "bottom band";
        case "left": return "left side";
        case "right": return "right side";
        case "split-v": return "two side-by-side halves (left/right)";
        case "split-h": return "top/bottom halves";
        default: return area;
      }
    }
    // 9:16 / 4:5 → fasce verticali, messaggio in banda centrale
    switch (area) {
      case "full": return "full-bleed vertical frame";
      case "top": return "top band (below the ~250px safe zone)";
      case "upper": return "upper third";
      case "center": return "central band (the dominant zone)";
      case "lower": return "lower third";
      case "bottom": return "bottom band (above the ~340px safe zone)";
      case "left": return "left column";
      case "right": return "right column";
      case "split-v": return "two stacked/side halves";
      case "split-h": return "stacked top/bottom bands";
      default: return area;
    }
  };
  return spec
    .map((z) => `${z.token}[${z.role}] in the ${areaPhrase(z.area)} (~${z.weight}%)`)
    .join("; ");
}
