"use client";

import api from "@/app/_lib/axios";

function toAbsoluteUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
  const baseTrimmed = base.replace(/\/+$/, "");
  const pathTrimmed = String(url).replace(/^\/+/, "");
  return `${baseTrimmed}/${pathTrimmed}`;
}

// 랭킹 클립 조회
export async function getRankingClips({ page = 0, size = 30 } = {}) {
  const { data } = await api.get('/api/ranking/clips', { params: { page, size } });
  const content = Array.isArray(data?.content) ? data.content : [];
  const items = content.map((c) => ({
    id: c.clipId,
    clipId: c.clipId,
    uploaderId: c.uploaderId,
    name: c.uploaderName ?? "",
    caption: c.caption ?? c.description ?? "",
    handle: `@${c.uploaderName ?? ''}`,
    avatarUrl: toAbsoluteUrl(c.uploaderAvatarUrl),
    src: toAbsoluteUrl(c.videoUrl),
    score: Number(c.likeCount) || 0,
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements ?? items.length,
    last: data?.last ?? true,
  };
}


