// Catalogo dei 24 archetipi in 6 famiglie (dal "Manuale delle Statiche").
// Ogni archetipo porta: angolo, COPY RICHIESTO (cosa serve dal copy), indicazione
// visiva, le due leve (densità testo / stile visivo) e i trigger per l'auto-scelta.

import type { Archetype, Family } from "./types";

export const ARCHETYPES: Archetype[] = [
  // ---- Famiglia A — Messaggio & Hook ----
  {
    code: "01", name: "Big Statement", family: "A", angle: "Hook · Curiosità",
    copyRequired: "L'headline più forte dell'ad, tagliata a 5–9 parole",
    visual: "una sola frase forte al centro, tipografia enorme, sfondo essenziale",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/\b(mai|sempre|nessuno|tutti|smetti|basta|dimentica)\b/i],
  },
  {
    code: "02", name: "Listicle", family: "A", angle: "Hook · Valore",
    copyRequired: "Titolo a contatore + 3–5 voci da una riga ciascuna",
    visual: "lista breve numerata, numeri grandi, voci scannabili",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/(^|\n)\s*(\d+[.\)]|[-•])\s+/],
  },
  {
    code: "03", name: "Statistica / Big Number", family: "A", angle: "Logica · Prova",
    copyRequired: "Il numero/percentuale chiave + una riga di contesto sotto",
    visual: "numero gigante dominante, fonte piccola",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b\d[\d. ]*\s*(\+|%|mila|pazienti|clienti|recensioni|anni)\b/i],
  },
  {
    code: "04", name: "Domanda / Quiz", family: "A", angle: "Engagement",
    copyRequired: "La domanda diretta + 2–3 opzioni o un cliffhanger",
    visual: "domanda che identifica un target, tono conversazionale",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/\?\s*$/m, /\b(sapevi|ti riconosci|quanti|quale di questi)\b/i],
  },

  // ---- Famiglia B — Prova & Credibilità ----
  {
    code: "05", name: "Testimonianza", family: "B", angle: "Prova sociale",
    copyRequired: "Quote del cliente (breve) + Nome/ruolo",
    visual: "citazione del cliente in evidenza tra virgolette, volto reale",
    textDensity: "balanced", visualStyle: "native",
    triggers: [/[«“”»"].{12,}["»”«“]/, /\b(mi avevano|non mi sono|ho risolto|grazie a)\b/i],
  },
  {
    code: "06", name: "Screenshot recensione", family: "B", angle: "Prova · Native",
    copyRequired: "Testo del messaggio/recensione + Username o rating",
    visual: "finge un contenuto reale: chat, tweet, recensione store, look autentico",
    textDensity: "text-heavy", visualStyle: "native",
    triggers: [/\b(recensione|ha scritto|commento|chat)\b/i, /★/],
  },
  {
    code: "07", name: "As seen in / Press", family: "B", angle: "Autorità",
    copyRequired: "Headline di autorità + loghi/testate",
    visual: "loghi di testate o badge 'consigliato da', allineati e puliti",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(come visto su|as seen in|intervistato|in tv|stampa|visti su)\b/i],
  },
  {
    code: "08", name: "Rating aggregato", family: "B", angle: "Prova · Sintesi",
    copyRequired: "Voto medio + N° recensioni",
    visual: "stelle + numero di recensioni in evidenza",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b\d[.,]\d\s*(su|\/)\s*5\b/i, /\b\d[\d.]*\s*(recensioni|valutazioni)\b/i],
  },

  // ---- Famiglia C — Prodotto & Dimostrazione ----
  {
    code: "09", name: "Product Hero", family: "C", angle: "Desiderio",
    copyRequired: "Nome prodotto + mini-claim opzionale",
    visual: "prodotto protagonista, pulito, ben illuminato, sfondo che non distrae",
    textDensity: "image-led", visualStyle: "designed",
    triggers: [/\b(prodotto|dispositivo|kit|confezione)\b/i],
  },
  {
    code: "10", name: "Feature Callout", family: "C", angle: "Beneficio · Logica",
    copyRequired: "2–4 feature in una parola + beneficio per ciascuna",
    visual: "prodotto con frecce/etichette ordinate sulle caratteristiche",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(caratteristica|funzione|dotato di|tecnologia)\b/i],
  },
  {
    code: "11", name: "Before / After", family: "C", angle: "Pain · Trasformazione",
    copyRequired: "Etichetta Prima/Dopo + claim del risultato",
    visual: "split prima/dopo, stessa inquadratura, cambio chiaro",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(prima|dopo|before|after|trasformazione)\b/i],
  },
  {
    code: "12", name: "How it works / Step", family: "C", angle: "Come funziona · Logica",
    copyRequired: "3 step in poche parole + eventuale icona per step",
    visual: "processo in 3 passi numerati, sequenza sinistra→destra",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/\b(come funziona|in \d+ (step|passi|passaggi)|passo dopo passo)\b/i],
  },
  {
    code: "13", name: "Cosa include / Bundle", family: "C", angle: "Valore percepito",
    copyRequired: "Lista dei componenti + valore totale opzionale",
    visual: "tutti gli elementi inclusi disposti a vista, gerarchia chiara",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(cosa include|incluso nel|bundle|in omaggio)\b/i],
  },

  // ---- Famiglia D — Confronto & Logica ----
  {
    code: "14", name: "Comparison / Noi vs Loro", family: "D", angle: "Differenziazione",
    copyRequired: "3–5 criteri + spunte vs croci",
    visual: "tabella che confronta te con l'alternativa, ✓ vs ✗",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/\b(vs\.?|contro|a differenza di|rispetto a|invece di)\b/i],
  },
  {
    code: "15", name: "Mito vs Realtà", family: "D", angle: "Obiezione",
    copyRequired: "Il mito (riga 1) + la realtà (riga 2)",
    visual: "due fasce contrapposte: Mito (barrato) vs Realtà, smentita netta",
    textDensity: "text-heavy", visualStyle: "designed",
    triggers: [/\b(mito|si dice|molti credono|ti raccontano|in realta|non e vero|(?:non )?passa\b.{0,16}\bda sola|riposo e pazienza)\b/i],
  },
  {
    code: "16", name: "This or That", family: "D", angle: "Identificazione",
    copyRequired: "Le 2 opzioni + la spinta verso la scelta giusta",
    visual: "due opzioni a confronto, contrasto netto tra i due lati",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(questo o quello|this or that|scegli tra|sei piu)\b/i],
  },

  // ---- Famiglia E — Offerta & Conversione ----
  {
    code: "17", name: "Offerta / Promo", family: "E", angle: "Incentivo",
    copyRequired: "L'offerta esatta + CTA + eventuale codice",
    visual: "sconto/prezzo/promo come messaggio centrale, vantaggio leggibile in un colpo",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(sconto|offerta|promo|risparmia|prezzo|€\s*\d|\d+\s*%)/i],
  },
  {
    code: "18", name: "Garanzia / Risk reversal", family: "E", angle: "Rassicurazione",
    copyRequired: "La promessa di garanzia + condizioni in breve",
    visual: "'soddisfatto o rimborsato', badge di fiducia + numero giorni",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(garanzia|garantit|soddisfatti o rimborsati|rimborso|senza rischi)\b/i],
  },
  {
    code: "19", name: "Urgenza / Scarsità", family: "E", angle: "Spinta",
    copyRequired: "Il limite (tempo/quantità) + CTA immediata",
    visual: "tempo o stock limitati, conto alla rovescia, 'ultimi pezzi'",
    textDensity: "balanced", visualStyle: "designed",
    triggers: [/\b(ultimi posti|posti limitati|solo (fino|per)|scade|entro il|affrettati|ancora \d+ post)/i],
  },

  // ---- Famiglia F — Native & Contesto ----
  {
    code: "20", name: "Advertorial / Editoriale", family: "F", angle: "Native · Storytelling",
    copyRequired: "Titolo in stile testata + sommario/occhiello",
    visual: "sembra un articolo o una notizia, tono giornalistico credibile",
    textDensity: "text-heavy", visualStyle: "native",
    triggers: [/\b(articolo|editoriale|storia di|abbiamo scoperto)\b/i],
  },
  {
    code: "21", name: "Lifestyle / Aspirazionale", family: "F", angle: "Emotivo · Contesto",
    copyRequired: "Claim emotivo breve + logo discreto",
    visual: "il prodotto nella vita reale, scena desiderabile, persona reale",
    textDensity: "image-led", visualStyle: "native",
    triggers: [/\b(finalmente|torna a|immagina di|goditi|di nuovo)\b/i],
  },
  {
    code: "22", name: "Meme / Relatable", family: "F", angle: "Emotivo · Viralità",
    copyRequired: "Top/bottom text + riferimento riconoscibile",
    visual: "umorismo o situazione 'ci si riconosce', formato meme",
    textDensity: "text-heavy", visualStyle: "native",
    triggers: [/\b(quando|pov|nessuno:|io:|relatable)\b/i],
  },
  {
    code: "23", name: "Founder Note", family: "F", angle: "Fiducia · Personale",
    copyRequired: "Frase personale + firma/foto founder",
    visual: "messaggio personale del fondatore, tono umano, prima persona",
    textDensity: "balanced", visualStyle: "native",
    triggers: [/\b(dott\.?|dottor|dottoressa|sono il fondatore|mi chiamo|dal (19|20)\d\d|fondatore)\b/i],
  },
  {
    code: "24", name: "Flat lay / Unboxing", family: "F", angle: "Desiderio · Tattile",
    copyRequired: "Eventuale claim (niente o pochissimo testo)",
    visual: "prodotto + componenti visti dall'alto, ordinati, luce piena",
    textDensity: "image-led", visualStyle: "native",
    triggers: [/\b(unboxing|flat lay|cosa trovi dentro|apri la (scatola|confezione))\b/i],
  },
];

export function getArchetype(code: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.code === code);
}

export function archetypesByFamily(family: Family): Archetype[] {
  return ARCHETYPES.filter((a) => a.family === family);
}
