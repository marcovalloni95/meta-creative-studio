# Meta Creative Studio (MVP)

Un wizard in 2 step per generare **immagini** e **video animati** (semplici) per inserzioni Meta.
- Step 1: brief + formato + durata + allegati
- Step 2: selezione template + elementi (headline, testo, bullet, CTA)
- Output: PNG (client-side) e MP4 (server-side via ffmpeg, se disponibile)

## Requisiti
- Node.js 18+ (consigliato 20)
- (Opzionale per video) **ffmpeg** installato e disponibile in PATH

## Avvio
```bash
npm install
npm run dev
```
Apri http://localhost:3000

## Note
- Le immagini vengono generate nel browser tramite Canvas e scaricate come PNG.
- I video vengono generati lato server chiamando `ffmpeg` (color background + testi con animazione leggera).
  Se ffmpeg non è installato, l'API ritorna un errore leggibile.

## Image Prompt Generator (`/image-prompt`)
Tool **deterministico e offline** che, da un **copy Meta già scritto** + un **profilo stile
cliente** (estratto dalla landing page, riusabile), produce automaticamente il **prompt di
generazione immagine** per la creatività statica associata, pronto per **Gemini (Nano Banana)**
o ChatGPT.

- **Solo immagini statiche** (nessun video), formati **1:1** e **9:16**.
- Workflow: estrae i punti d'attacco dal copy → classifica l'**archetipo** tra i 22 del Manuale
  delle Statiche (6 famiglie) → compila il prompt a **6 blocchi** (Subject / Context /
  Photo Aesthetics / Text Overlay / Layout / Directive) per entrambi i formati.
- Da un copy lungo/ricco ricava **più statiche distinte** su famiglie diverse (mai una VSL) e
  segnala se al set manca una leva di conversione pura (Famiglia E).
- Tutto in locale, nessuna chiamata esterna né API key.

Codice del motore in `src/lib/imagePrompt/`:
- `archetypes.ts` → catalogo 22 archetipi / 6 famiglie con trigger
- `styleProfiles.ts` → profili stile cliente riusabili (preset Shoulder Center + generico)
- `extract.ts` → estrazione euristica di segnali e punti d'attacco dal copy
- `classify.ts` → assegnazione archetipo/i (single o multi-variante)
- `buildPrompt.ts` → assemblaggio prompt a blocchi + overlay per formato
- `index.ts` → `generate()` orchestratore

## Dove personalizzare
- `src/lib/templates.ts` → definizione template e regole tipografiche (wizard)
- `src/app/api/render-video/route.ts` → pipeline ffmpeg (testi, durata, formato)
- `src/lib/imagePrompt/` → logica del generatore di prompt immagine
