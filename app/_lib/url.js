"use client";

export function toAbsoluteUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
  const baseTrimmed = base.replace(/\/+$/, "");
  const pathTrimmed = String(url).replace(/^\/+/, "");
  return `${baseTrimmed}/${pathTrimmed}`;
}


