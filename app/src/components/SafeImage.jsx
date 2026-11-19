"use client";
import { useState } from "react";
import Image from "next/image";
import { Image_Not_Found } from "../const";

/**
 * next/image with a loop-safe fallback.
 *
 * Never fix a broken next/image by doing `e.currentTarget.src = ...` in onError:
 * next/image also sets `srcset`, so the browser keeps re-requesting the failing
 * srcset URL, onError fires again, and the page sends requests forever.
 *
 * Instead the failure is tracked in state:
 *   1st error → the /_next/image optimizer failed (e.g. 504 from a slow image
 *               host) → load the original URL directly (unoptimized)
 *   2nd error → the original failed too → show the placeholder, then stop.
 * The counter resets when `src` changes.
 */
export default function SafeImage({
  src,
  fallbackSrc = Image_Not_Found,
  unoptimized,
  alt = "",
  ...props
}) {
  const [failure, setFailure] = useState({ src, level: 0 });
  const level = failure.src === src ? failure.level : 0;
  const showFallback = !src || level >= 2;

  return (
    <Image
      {...props}
      alt={alt}
      src={showFallback ? fallbackSrc : src}
      unoptimized={showFallback || level === 1 || unoptimized}
      onError={() => {
        if (!showFallback) setFailure({ src, level: level + 1 });
      }}
    />
  );
}
