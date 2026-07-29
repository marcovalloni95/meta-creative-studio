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

- **Solo immagini statiche** (nessun video): immagine singola o **carosello** (un prompt per slide), formati **1:1 / 4:5 / 9:16**.
- Input: copy, **Famiglia** del Manuale (A–F) + archetipo, **Scopo**, statica/carosello, **Modello** (Nano Banana / ChatGPT / Midjourney / Higgsfield), **palette**, **logo**.
- Ogni prompt include **Ruolo + Contesto + Task + Formato + Negative**, con **gerarchia visiva/wireframe**, posizionamento di testo/grafica/foto per formato e **CTA** integrata per archetipo.
- **Render mode**: photo → prompt immagine · typographic → render tipografico esatto (HTML→PNG) · hybrid → prompt "solo sfondo" + layer testo.
- Tutto in locale, nessuna chiamata esterna né API key.

**Linee guida creatività**: vedi [`docs/linee-guida-creativita.md`](docs/linee-guida-creativita.md) (metodo dal workshop AI Creativa · 4ECOM/Loop), applicate automaticamente dal generatore.

Codice del motore in `src/lib/imagePrompt/`:
- `archetypes.ts` → catalogo 24 archetipi / 6 famiglie (con COPY RICHIESTO)
- `layouts.ts` → blueprint di layout/wireframe + CTA per archetipo e formato
- `guidelines.ts` → ruolo, best practice, negative e hint modello (dal workshop)
- `renderModes.ts` / `typography.ts` → render mode e render tipografico esatto
- `extract.ts` / `classify.ts` → punti d'attacco + scelta archetipo e piano carosello
- `buildPrompt.ts` → assemblaggio prompt (per modello/formato) + `index.ts` → `generate()`

## Dove personalizzare
- `src/lib/templates.ts` → definizione template e regole tipografiche (wizard)
- `src/app/api/render-video/route.ts` → pipeline ffmpeg (testi, durata, formato)
- `src/lib/imagePrompt/` → logica del generatore di prompt immagine
