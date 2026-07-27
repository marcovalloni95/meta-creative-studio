// Catalogo dei 22 archetipi di creativita statica, organizzati in 6 famiglie.
// Ogni archetipo dichiara i trigger (segnali nel copy) che lo attivano, il ruolo
// dell'overlay e un'indicazione visiva sintetica. Usato dal classificatore.

import type { Archetype } from "./types";

export const ARCHETYPES: Archetype[] = [
  // Famiglia A — Messaggio & Hook
  {
    code: "01",
    name: "Big Statement",
    family: "A",
    triggers: [
  /\b(mai|sempre|nessuno|tutti|smetti|basta|dimentica)\b/i,
  /\b(ma|però|solo che|il problema è|tranne)\b\s*\.{2,}/i,   // open loop
  /\.{3}\s*$/,                                               // sospensione finale
],
    overlayRole: "affermazione dominante (1 frase enorme, alto contrasto)",
    visual: "sfondo minimale o tinta piena, una sola frase eroe tipografica",
  },
  {
    code: "02",
    name: "Listicle",
    family: "A",
    triggers: [/(^|\n)\s*(\d+[\.\)]|[-•])\s+/],
    overlayRole: "3-5 bullet corti numerati con gerarchia chiara",
    visual: "lista pulita di micro-benefici, un titolo breve in alto",
  },
  {
    code: "03",
    name: "Statistica / Big Number",
    family: "A",
    triggers: [/\b\d[\d. ]*\s*(\+|%|mila|pazienti|clienti|recensioni|anni)\b/i],
    overlayRole: "il numero gigante come eroe visivo + didascalia breve",
    visual: "numero enorme al centro, foto/tinta di supporto secondaria",
  },
  {
    code: "04",
    name: "Domanda / Quiz",
    family: "A",
    triggers: [/\?\s*$/m, /\b(sapevi|ti riconosci|quanti|perche)\b/i],
    overlayRole: "domanda diretta, tono conversazionale",
    visual: "domanda in overlay grande, volto o scena che qualifica il prospect",
  },

  // Famiglia B — Prova & Credibilita
  {
    code: "05",
    name: "Testimonianza",
    family: "B",
    triggers: [/[«“”»"].{12,}["»”«“]/, /\b(mi avevano|non mi sono|ho risolto|grazie a|dopo (anni|mesi))\b/i],
    overlayRole: "quote verbatim del cliente + badge 'cliente/paziente reale'",
    visual: "volto/persona reale, quote su fascia leggibile, tono documentaristico",
  },
  {
    code: "06",
    name: "Screenshot recensione",
    family: "B",
    triggers: [/\b(recensione|ha scritto|commento)\b/i, /★|\bstelle\b/i],
    overlayRole: "screenshot recensione (stelle + testo) come oggetto autentico",
    visual: "card recensione realistica, stelle in evidenza",
  },
  {
    code: "07",
    name: "As seen in / Press",
    family: "B",
    triggers: [/\b(come visto su|as seen in|intervistato|sul giornale|in tv|stampa)\b/i],
    overlayRole: "loghi testate / 'come visto su'",
    visual: "fascia loghi media + claim breve",
  },
  {
    code: "08",
    name: "Rating aggregato",
    family: "B",
    triggers: [/\b\d[\d.]*\s*(recensioni|valutazioni)\b/i, /\b\d[.,]\d\s*(su|\/)\s*5\b/i],
    overlayRole: "rating a stelle + numero recensioni",
    visual: "media voti grande, stelle, numero recensioni come prova",
  },

  // Famiglia C — Prodotto & Dimostrazione
  {
    code: "09",
    name: "Product Hero",
    family: "C",
    triggers: [/\b(prodotto|dispositivo|kit|confezione|hero)\b/i],
    overlayRole: "claim breve, prodotto protagonista",
    visual: "hero shot del prodotto in primo piano",
  },
  {
    code: "10",
    name: "Feature Callout",
    family: "C",
    triggers: [/\b(caratteristica|funzione|dotato di|include la|tecnologia)\b/i],
    overlayRole: "1-3 etichette che puntano ai dettagli chiave",
    visual: "prodotto con linee/callout verso le feature",
  },
  {
    code: "11",
    name: "Before / After",
    family: "C",
    triggers: [/\b(prima|dopo|before|after|trasformazione|risultato in)\b/i],
    overlayRole: "etichette 'Prima' / 'Dopo'",
    visual: "split netto prima/dopo, stesso inquadramento",
  },
  {
    code: "12",
    name: "How it works",
    family: "C",
    triggers: [/\b(come funziona|in \d+ (step|passi|passaggi)|passo dopo passo)\b/i],
    overlayRole: "2-4 step numerati",
    visual: "sequenza di step con icone/foto",
  },
  {
    code: "13",
    name: "Cosa include / Bundle",
    family: "C",
    triggers: [/\b(cosa include|incluso nel|bundle|pacchetto comprende|in omaggio)\b/i],
    overlayRole: "griglia degli elementi inclusi",
    visual: "flat lay / griglia degli item del pacchetto",
  },

  // Famiglia D — Confronto & Logica
  {
    code: "14",
    name: "Comparison / Noi vs Loro",
    family: "D",
    triggers: [/\b(vs\.?|contro|a differenza di|rispetto a|invece di|noi vs)\b/i],
    overlayRole: "due colonne a confronto, check vs croce",
    visual: "tabella/colonne 'Noi' vs 'Altri' con simboli si/no",
  },
  {
    code: "15",
    name: "Mito vs Realta",
    family: "D",
    triggers: [/\b(mito|si dice|molti credono|falso[:!]|in realta|non e vero|pensi che|passa da sola)\b/i],
    overlayRole: "due fasce contrapposte: 'Mito' vs 'Realta'",
    visual: "split verticale/orizzontale Mito (barrato) vs Realta",
  },
  {
    code: "16",
    name: "This or That",
    family: "D",
    triggers: [/\b(questo o quello|this or that|scegli tra|meglio.*o)\b/i],
    overlayRole: "due opzioni affiancate, invito a scegliere",
    visual: "due opzioni A/B affiancate",
  },

  // Famiglia E — Offerta & Conversione
  {
    code: "17",
    name: "Offerta / Promo",
    family: "E",
    triggers: [/\b(sconto|offerta|promo|risparmia|€\s*\d|\bgratis\b|gratuit)/i],
    overlayRole: "prezzo/offerta come eroe + CTA forte",
    visual: "offerta grande, CTA a contrasto",
  },
  {
    code: "18",
    name: "Garanzia / Risk reversal",
    family: "E",
    triggers: [/\b(garanzia|garantit|soddisfatti o rimborsati|rimborso|senza rischi)\b/i],
    overlayRole: "badge garanzia + promessa di reversal",
    visual: "sigillo/badge garanzia in evidenza",
  },
  {
    code: "19",
    name: "Urgenza / Scarsita",
    family: "E",
    triggers: [/\b(ultimi posti|posti limitati|solo (fino|per)|scade|entro il|affrettati|termina|ancora \d+ post)/i],
    overlayRole: "scadenza/posti limitati + tono d'azione",
    visual: "countdown / 'ultimi posti', urgenza visiva",
  },

  // Famiglia F — Native & Contesto
  {
    code: "20",
    name: "Advertorial / Editoriale",
    family: "F",
    triggers: [/\b(articolo|editoriale|storia di|abbiamo scoperto|redazionale)\b/i],
    overlayRole: "titolo + testo, look da articolo",
    visual: "layout editoriale, foto documentaristica + titolo giornalistico",
  },
  {
    code: "21",
    name: "Lifestyle / Aspirazionale",
    family: "F",
    triggers: [/\b(finalmente|torna a|immagina di|goditi|di nuovo libero)\b/i],
    overlayRole: "overlay leggero sul desiderio/stile di vita",
    visual: "scena lifestyle credibile, overlay minimo",
  },
  {
    code: "22",
    name: "Meme / Relatable",
    family: "F",
    triggers: [/\b(quando|pov|nessuno:|io:|relatable)\b/i],
    overlayRole: "testo relatable in formato meme",
    visual: "formato meme, testo ironico condiviso",
  },
  {
    code: "23",
    name: "Founder Note",
    family: "F",
    triggers: [/\b(dott\.?|dottor|dottoressa|sono il fondatore|mi chiamo|dal (19|20)\d\d|fondatore)\b/i],
    overlayRole: "nota firmata in prima persona dell'autorita/founder",
    visual: "ritratto founder + nota manoscritta/firmata",
  },
  {
    code: "24",
    name: "Flat lay / Unboxing",
    family: "F",
    triggers: [/\b(unboxing|flat lay|cosa trovi dentro|apri la (scatola|confezione))\b/i],
    overlayRole: "overlay minimo, focus sul set dall'alto",
    visual: "flat lay ordinato top-down dei materiali/prodotti",
  },
];

export function getArchetype(code: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.code === code);
}
