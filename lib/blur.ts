import { blurData } from "./blurData.generated";

/**
 * next/image blur-placeholder props for a local public-path image
 * (e.g. "/images/gbp/photo-1.jpg"), or {} when no blur was generated.
 * Spread onto an <Image>: `<Image {...blurProps(src)} … />`.
 * Blur data is produced by scripts/gen-blur.mjs.
 */
export function blurProps(
  src: string
): { placeholder?: "blur"; blurDataURL?: string } {
  const blurDataURL = blurData[src];
  return blurDataURL ? { placeholder: "blur", blurDataURL } : {};
}
