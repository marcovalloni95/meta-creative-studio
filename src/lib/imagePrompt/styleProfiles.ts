// Profili stile cliente (asset riusabili, estratti dalla landing page).
// Lo stile NON e un default fisso: si estrae dalla landing del cliente e si
// riusa. Qui sono precaricati alcuni profili + un profilo generico editabile.

import type { StyleProfile } from "./types";

export const STYLE_PROFILES: StyleProfile[] = [
  {
    id: "shoulder-center",
    name: "Shoulder Center",
    subject:
      "a real person aged 45-65 with a genuine, candid expression, caught mid-gesture in an everyday action",
    context:
      "everyday real-life setting (home, tennis court, home office), natural and non-staged, absolutely no clinical elements (no white coats, no medical beds, no equipment)",
    photoAesthetics:
      "Shoulder Center house style: candid documentary photo, natural daylight (never studio), subtle semi-transparent red glow over the exact painful shoulder point; whole frame styled as a slightly rotated (3-5 degrees) white-border polaroid, real-proof feel, not advertising gloss",
    palette: { text: "navy blue", cta: "green", accent: "orange" },
    negatives:
      "clinical setting, white coats, medical beds or equipment, stock-photo gloss, studio flash, pure white e-commerce background, watermark, extra logos, distorted hands, misspelled Italian text",
    moment:
      "the pain caught in the act: an everyday gesture interrupted by the shoulder pain (not a before/after)",
  },
  {
    id: "generic",
    name: "Generico (da personalizzare)",
    subject:
      "a real, relatable person matching the target audience, natural candid expression",
    context:
      "a real, believable everyday setting coherent with the brand positioning",
    photoAesthetics:
      "candid, non-glossy documentary photo, natural light, authentic real-life feel, not stock and not advertising gloss",
    palette: { text: "dark neutral", cta: "brand accent", accent: "secondary accent" },
    negatives:
      "stock-photo gloss, studio flash, pure white e-commerce background, watermark, extra logos, distorted hands, misspelled text",
    moment: "the most emotionally relevant real moment implied by the copy",
  },
];

export function getStyleProfile(id: string): StyleProfile {
  return STYLE_PROFILES.find((p) => p.id === id) ?? STYLE_PROFILES[STYLE_PROFILES.length - 1];
}
