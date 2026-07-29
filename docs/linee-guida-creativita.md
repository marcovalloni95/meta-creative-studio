# Linee guida creatività (workshop AI Creativa · 4ECOM / Loop Srl)

Sintesi operativa del workshop *"AI Creativa: Produci di più mantenendo la qualità"*,
adottata come guida su **come costruire una creatività** e **quale deve essere l'output**.
Queste regole sono anche applicate automaticamente dal tool `/image-prompt`
(vedi `src/lib/imagePrompt/guidelines.ts`).

## Principio di fondo
L'AI accelera l'**esecuzione**; la **strategia** resta umana. Un brief vago produce
creatività mediocre, con o senza AI: il prompt è il brief che non puoi delegare.

## Struttura del prompt efficace
Ogni prompt creativo ha sempre gli stessi blocchi — cambia solo il contenuto:

1. **Ruolo** — chi deve essere l'AI (es. *art director advertising e-commerce*).
2. **Contesto** — brand, target, obiettivo, tone of voice.
3. **Task** — cosa fare esattamente.
4. **Formato** — dimensioni/ratio del placement (1:1, 4:5, 9:16) e safe zone.
5. **Negative** — cosa escludere esplicitamente.

> Riutilizzalo come **prompt madre**: è un asset, non una richiesta una-tantum.

### Negative (dire sempre cosa NON vuoi)
Default: no cartoon/illustrazione, no 3D/CGI o look "AI-glossy" plasticoso, no testo
distorto o con errori, no watermark, no loghi inventati o dei competitor, no più di una
CTA, no composizione affollata, no bassa risoluzione, no mani/volti deformi.
*(Lo sfondo neutro/pulito NON è vietato: alcuni archetipi lo richiedono.)*

## Best practice per le statiche
1. **Meno testo è meglio** — se una parola si può togliere, toglila.
2. **Gerarchia visiva** — un solo protagonista; l'occhio legge alto-sinistra → basso-destra.
3. **Coerenza di brand** — font, colori e stile foto identici su tutti i formati/piattaforme.
4. **Una sola CTA** — due CTA = zero CTA. Rendila impossibile da ignorare.
5. **Test con occhio fresco** — deve capirsi in 3 secondi; controlla lo zoom-out a misura mobile.

## Da dove si parte
- **Asset foto-grafici**: caricali e indicali nel prompt come elementi da usare.
- **Reference**: falla analizzare all'AI e fatti creare un prompt per riprodurla.
- **Da zero**: dai tutte le indicazioni e costruisci un prompt "madre".

## Quale modello usare (immagini)
- **Nano Banana** — varianti rapide e A/B test per campagne Meta con molte creatività.
- **GPT Image (ChatGPT)** — brief dettagliati, prodotto + persona lifestyle, coerenza tra asset.
- **Midjourney** — qualità artistica, lifestyle/fashion, contenuti organici.
- **Higgsfield** — still cinematografici / editing.
- *Per il testo dentro l'immagine* i modelli di diffusione sono deboli: il tool usa il
  **render tipografico esatto** (HTML→PNG) per gli archetipi typographic/hybrid.

## Iterazione
Cambia **una variabile alla volta** (headline, colore, soggetto, composizione, CTA),
costruisci una **libreria interna** di prompt testati, traccia CTR/CPC e migliora.

## Formati e safe zone
Ogni piattaforma ha il suo formato: indicalo sempre in fase di prompting.
- 1:1 → 1080×1080 · 4:5 → 1080×1350 · 9:16 → 1080×1920 (safe zone ~250px sopra / ~340px sotto).

---
*Fonte: workshop "AI Creativa · Produci di più mantenendo la qualità", 4ECOM / Loop Srl.*
