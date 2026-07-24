import type { Aspect } from "./types";

export const aspectToPixels: Record<Aspect, { w: number; h: number }> = {
  "1:1": { w: 1080, h: 1080 },
  "4:5": { w: 1080, h: 1350 },
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
};

export function safeArea(width: number, height: number) {
  // safe area conservativa (padding 8%)
  const padX = Math.round(width * 0.08);
  const padY = Math.round(height * 0.08);
  return { x: padX, y: padY, w: width - padX * 2, h: height - padY * 2 };
}
