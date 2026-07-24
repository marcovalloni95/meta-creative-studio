import type { TemplateDef } from "./types";

export const templates: TemplateDef[] = [
  {
    id: "t_minimal_left",
    name: "Minimal • Left Stack",
    description: "Testo pulito, gerarchia forte, CTA chiara",
    bg: "gradientA",
    headlineSize: 1.0,
    bodySize: 0.92,
    bulletSize: 0.90,
    ctaSize: 0.95,
    layout: "leftStack",
  },
  {
    id: "t_center_hero",
    name: "Hero • Center Stack",
    description: "Hook centrato, ideale per claim breve",
    bg: "gradientB",
    headlineSize: 1.1,
    bodySize: 0.95,
    bulletSize: 0.90,
    ctaSize: 1.0,
    layout: "centerStack",
  },
  {
    id: "t_split",
    name: "Split • Text + Visual",
    description: "Area testo a sinistra, area visual a destra (placeholder)",
    bg: "solidDark",
    headlineSize: 1.0,
    bodySize: 0.92,
    bulletSize: 0.90,
    ctaSize: 0.95,
    layout: "split",
  },
  {
    id: "t_badge",
    name: "Badge • Promo",
    description: "Intestazione a badge + lista benefici",
    bg: "solidLight",
    headlineSize: 1.0,
    bodySize: 0.90,
    bulletSize: 0.92,
    ctaSize: 0.95,
    layout: "badgeTop",
  },
];

export function getTemplate(id: string): TemplateDef {
  const t = templates.find(x => x.id === id);
  return t ?? templates[0];
}
