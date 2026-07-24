export type OutputKind = "image" | "video";
export type Aspect = "1:1" | "4:5" | "9:16" | "16:9";
export type VideoDuration = "<5" | "6-30" | "30-60";

export type Brief = {
  kind: OutputKind;
  idea: string;

  aspect: Aspect;
  // derived pixel size (editable internally)
  width: number;
  height: number;

  duration?: VideoDuration;

  // optional content blocks
  headline?: string;
  body?: string;
  bullets?: string[];
  cta?: string;

  // feature toggles
  includeHeadline: boolean;
  includeBody: boolean;
  includeBullets: boolean;
  includeCTA: boolean;

  templateId: string;

  // attachments metadata (stored client-side only for MVP)
  attachments?: { name: string; size: number; type: string }[];
};

export type TemplateDef = {
  id: string;
  name: string;
  description: string;
  // background style token (rendered in canvas)
  bg: "gradientA" | "gradientB" | "solidDark" | "solidLight";
  // typography tuning
  headlineSize: number; // relative
  bodySize: number;
  bulletSize: number;
  ctaSize: number;
  // layout flavor
  layout: "leftStack" | "centerStack" | "split" | "badgeTop";
};
