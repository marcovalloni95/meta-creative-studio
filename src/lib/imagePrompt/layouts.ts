// Blueprint di layout / wireframe per ciascuno dei 24 archetipi.
// Per ogni archetipo: gerarchia visiva, posizionamento degli elementi
// (testo/hook, grafica, foto) nei formati 1:1 e 9:16, e come integrare la
// Leva (CTA). Serve a rendere il prompt una vera indicazione per lo studio
// grafico / il modello immagine.

export type ArchetypeLayout = {
  hierarchy: string; // gerarchia visiva / wireframe (cosa domina, in che ordine)
  square: string; //    posizionamento elementi nel 1:1 (1080x1080)
  vertical: string; //  posizionamento elementi nel 9:16 (1080x1920) + safe zone
  cta: string; //       come integrare e posizionare la Leva (CTA)
};

// Nota: le stringhe sono in inglese (istruzioni per il modello immagine), la CTA
// esatta e il testo overlay restano nella lingua del copy (iniettati altrove).
export const LAYOUTS: Record<string, ArchetypeLayout> = {
  "01": {
    hierarchy:
      "One dominant headline (5-9 words) IS the entire creative; everything else is subordinate. Huge high-contrast display type, solid-tint or minimal background, generous negative space, one single idea.",
    square: "Headline centered in the middle 60-70% of the frame (2-3 lines max); small logo top or bottom; nothing competes with the headline.",
    vertical: "Headline stacked in the central third at the largest size; logo just inside the top safe area; keep top ~250px and bottom ~340px clear.",
    cta: "One CTA pill directly BELOW the headline, in the CTA/accent color, clearly smaller than the headline so it supports, never rivals, the statement.",
  },
  "02": {
    hierarchy:
      "A counter-based title on top ('3 …', '5 …') then 3-5 one-line scannable items stacked with big numerals/bullets, strong left alignment, equal spacing; no paragraphs.",
    square: "Title in the top ~20%; the numbered list fills the middle; numerals in the accent color; short lines.",
    vertical: "Title in the upper third (below top safe zone); list down the center with larger gaps between items; safe zones clear.",
    cta: "CTA as the visual 'unlock' at the END of the list: a full-width pill in the CTA color, framed as the payoff after the last item.",
  },
  "03": {
    hierarchy:
      "The number/percentage is the hero: gigantic, dominating ~45-55% of the frame; one short context line immediately beneath in much smaller type; supporting photo/tint recedes.",
    square: "Giant number upper-center, context line just under it, supporting image/tint in the lower band.",
    vertical: "Giant number in the central third over a full-bleed supporting background; context line right below; safe zones clear.",
    cta: "CTA below the context line, visually linking the proof to the next step; accent-colored, secondary to the number.",
  },
  "04": {
    hierarchy:
      "A direct question with a cliffhanger dominates the top/center, optionally with 2 contrasting answer options; conversational, high curiosity.",
    square: "Question centered in the upper 60%; optional A/B options as two contrasting chips below.",
    vertical: "Question in the central third; options stacked or side-by-side below; safe zones clear.",
    cta: "CTA framed as the way to answer/interact ('scopri la risposta', 'fai il test'), placed under the options as the resolving action.",
  },
  "05": {
    hierarchy:
      "A real customer quote in quotation marks is the focal text, paired with a genuine photo of the person; name/role attribution small beneath; documentary, non-glossy.",
    square: "Photo fills ~60-65% (one side or lower); quote on a clean band with a big opening quotation mark; name+role under the quote; small 'cliente reale' badge.",
    vertical: "Person photo full-bleed; quote in the central third on a legible scrim; attribution below; safe zones clear.",
    cta: "CTA directly under the attribution, guiding the reader from proof to immediate action; accent-colored pill.",
  },
  "06": {
    hierarchy:
      "A faithful, native-looking screenshot (chat bubble / tweet / review card / email) IS the whole creative, with realistic details: star rating, username/handle, timestamp; raw, unbranded feel.",
    square: "The review/chat card centered, filling most of the frame; subtle real-UI chrome; minimal brand presence.",
    vertical: "Screenshot enlarged in the central safe area; optionally a second review stacked; safe zones clear.",
    cta: "CTA as the natural next step just BELOW the screenshot (a small caption + pill), never inside the fake UI, to preserve credibility.",
  },
  "07": {
    hierarchy:
      "An authority headline over an orderly horizontal strip/row of recognizable press/TV/certification logos, evenly aligned and monochrome for cohesion.",
    square: "Authority headline in the upper third; logo strip centered mid-frame; ample whitespace.",
    vertical: "Headline high (below safe zone); logos in 2 tidy centered rows; safe zones clear.",
    cta: "CTA directly beneath the logo strip so the borrowed authority flows into the button; accent-colored.",
  },
  "08": {
    hierarchy:
      "Five large graphic stars dominate, with the numeric average score and the total review volume adjacent; instant read of high approval.",
    square: "Stars centered upper-middle (big); average score large beside/under them; '(N recensioni)' small below.",
    vertical: "Stars + score in the central third; review count below; safe zones clear.",
    cta: "Layout leads the eye downward stars -> score -> CTA pill; CTA accent-colored, immediately under the volume line.",
  },
  "09": {
    hierarchy:
      "A high-res packshot of the product isolated on a clean/monochrome non-distracting background is the hero; brand name + a micro positioning claim are minimal.",
    square: "Product centered and large; brand name top or bottom; micro-claim one short line.",
    vertical: "Product centered and crisp in the safe area; claim below; safe zones clear.",
    cta: "Minimal, clear CTA pill at the bottom for purchase/request, small enough never to compete with the product.",
  },
  "10": {
    hierarchy:
      "A central product image/render surrounded by 2-4 clean callout labels with thin leader lines, each a one-word feature + short benefit.",
    square: "Product centered; 2-4 labels around it, balanced left/right, with leader lines.",
    vertical: "Product central; callouts stacked around it top/bottom; safe zones clear.",
    cta: "CTA as the final action after reading the callouts, bottom-center, accent-colored.",
  },
  "11": {
    hierarchy:
      "A split layout comparing 'Prima' and 'Dopo' with identical framing, light and context; clear divider; the result side subtly emphasized.",
    square: "Vertical split left(Prima)/right(Dopo) with labels on each half.",
    vertical: "Top(Prima)/bottom(Dopo) split with labels; safe zones clear.",
    cta: "CTA positioned as the bridge/means to the transformation: centered on the divider or under the 'Dopo' side.",
  },
  "12": {
    hierarchy:
      "A guided sequence of 3-4 numbered chronological steps arranged linearly with short text and intuitive icons; reassuring simplicity.",
    square: "3 steps left->right as a row with big numerals + icons + short captions.",
    vertical: "Steps stacked top->bottom with a connecting line; safe zones clear.",
    cta: "CTA as the last step / start button ('Inizia ora') at the end of the sequence, accent-colored.",
  },
  "13": {
    hierarchy:
      "All included items laid out geometrically (knolling), with a text list of components and a highlighted total/bonus value; the richness of the offer is obvious.",
    square: "Items in a tidy grid filling the frame; value badge in a corner; component list along one side.",
    vertical: "Items grid in the central area; component list below; value badge prominent; safe zones clear.",
    cta: "CTA as the action to claim the whole bundle, bottom-center, accent-colored, near the total-value badge.",
  },
  "14": {
    hierarchy:
      "A two-column comparison table: our brand vs a generic competitor across 3-5 criteria, using green checks vs red crosses; our column visually favored.",
    square: "Table centered; our column highlighted (accent header); criteria rows with green tick vs red cross.",
    vertical: "Table stacked with the two columns side by side, fewer rows; safe zones clear.",
    cta: "CTA at the BASE of OUR column to channel the logical choice; accent-colored.",
  },
  "15": {
    hierarchy:
      "A horizontal split into two clear blocks: the top states the common false myth (alert color/✗ icon), the bottom gives the objective reality and the real solution (brand color/✓).",
    square: "Top half 'MITO' (muted/alert), bottom half 'REALTÀ' (brand color); strong central divider.",
    vertical: "Myth in the upper third, reality lower-central; strong divider; safe zones clear.",
    cta: "CTA inside the 'Realtà' block as the access route to the real solution; accent-colored.",
  },
  "16": {
    hierarchy:
      "Two contrasting scenarios/user-types on opposite sides (left vs right) with a central resolving element; drives self-identification.",
    square: "Left/right split, each side a scenario with icon + label; a central seam.",
    vertical: "Top/bottom (or left/right) split with a central CTA hub; safe zones clear.",
    cta: "CTA acts as the central PIVOT/resolver between the two options, centered, accent-colored.",
  },
  "17": {
    hierarchy:
      "The discount %/free/special price is the dominant visual by size; a transactional CTA and an optional coupon code sit beside it.",
    square: "Big offer figure centered; coupon code chip below; product/tint supporting.",
    vertical: "Offer figure in the central third; code below; safe zones clear.",
    cta: "CTA is THE primary, high-contrast button to redeem the offer, directly under the price.",
  },
  "18": {
    hierarchy:
      "A clear tutelage promise sealed by a dedicated badge/seal (circular text, security icon) with the validity terms; kills purchase anxiety.",
    square: "Guarantee badge/seal large and centered; promise line under it; terms small.",
    vertical: "Badge central; promise + terms below; safe zones clear.",
    cta: "CTA paired directly WITH the guarantee seal to reassure before the click; accent-colored, adjacent to the badge.",
  },
  "19": {
    hierarchy:
      "High-impact color elements signal a hard deadline or limited stock/slots, with alert indicators (countdown, 'ultimi posti') and an immediate CTA.",
    square: "Urgency banner/countdown on top; limit statement center; alert-color accents.",
    vertical: "Countdown/limit in the central third; alert accents; safe zones clear.",
    cta: "CTA is the largest, most contrasted element, immediately below the limit — the only timely action to avoid losing the opportunity.",
  },
  "20": {
    hierarchy:
      "Laid out like a real news article/blog: a serif newspaper-style headline, a subhead/summary, body text in columns; authoritative editorial tone.",
    square: "Serif headline top, subhead under, one text column + a documentary photo; a masthead-like touch.",
    vertical: "Headline + subhead high, photo mid, text column below; safe zones clear.",
    cta: "CTA embedded discreetly at the END of (or within) the faux article as an inline link / small button, not a loud ad button.",
  },
  "21": {
    hierarchy:
      "A real, high-craft contextual scene with subjects in action; minimal text (only a very short evocative claim) and a discreet logo; emotional aspiration.",
    square: "Full-bleed lifestyle photo; a tiny claim in one corner; small logo.",
    vertical: "Full-bleed vertical scene; claim in the lower-central safe area; safe zones clear.",
    cta: "CTA elegant and non-invasive: a slim pill or text link in a lower corner, matching the minimal look.",
  },
  "22": {
    hierarchy:
      "Classic social meme structure: top and/or bottom caption text over a reaction image / recognizable pop frame; ironic, native to the feed.",
    square: "Impact/condensed caption top and/or bottom over the image; meme aesthetic.",
    vertical: "Caption top, image center, optional bottom caption; safe zones clear.",
    cta: "CTA kept subtle so it doesn't break the native/ironic feel: a small caption line or first-comment-style prompt, not a hard button.",
  },
  "23": {
    hierarchy:
      "A medium-length first-person message in a handwriting/open-letter style, completed by the founder's real signature or close-up photo; human and transparent.",
    square: "Letter text block centered; founder photo small top or signature bottom-right.",
    vertical: "Text block in the central area; founder photo top (inside safe zone), signature at the end; safe zones clear.",
    cta: "CTA as a final personalized invitation signed by the founder (e.g. '— [nome], fondatore'), a gentle pill after the signature.",
  },
  "24": {
    hierarchy:
      "A top-down (zenithal) photo with clean diffuse light showing the opened box and contents arranged in precise geometry; minimal or no overlaid text.",
    square: "Perfectly perpendicular flat lay filling the frame; items knolled; near-zero text.",
    vertical: "Zenithal composition centered with a more vertical arrangement of items; safe zones clear.",
    cta: "CTA added minimally as a small tag/printed card object within the scene (e.g. a card beside the box), so it doesn't break the geometric aesthetic.",
  },
};

const FALLBACK: ArchetypeLayout = {
  hierarchy: "One dominant element, clear visual hierarchy, thumbnail-legible; everything else subordinate.",
  square: "Main element centered; supporting elements balanced; keep clear of the outer 8% margins.",
  vertical: "Main element in the central third; supporting elements above/below; keep top ~250px and bottom ~340px clear.",
  cta: "One CTA pill in the CTA/accent color, placed as the resolving action at the bottom-center.",
};

export function getLayout(code: string): ArchetypeLayout {
  return LAYOUTS[code] ?? FALLBACK;
}
