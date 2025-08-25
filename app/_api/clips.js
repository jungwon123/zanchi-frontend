"use client";

import api from "@/app/_lib/axios";

function toAbsoluteUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
    "https://zanchi.duckdns.org";
  const baseTrimmed = base.replace(/\/+$/, "");
  const pathTrimmed = String(url).replace(/^\/+/, "");
  return `${baseTrimmed}/${pathTrimmed}`;
}

// 공통: 클립 업로드 (multipart/form-data)
export async function uploadClip({ file, caption }) {
  const form = new FormData();
  if (file) form.append("video", file, file.name || "upload.mp4");
  form.append("caption", caption ?? "");
  // 클립 업로드는 전역 JSON 헤더를 덮어쓰고 multipart/form-data로 전송
  const { data } = await api.post("/api/clips", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// 클립 전체 조회(피드가 아닌 모든 클립 리스트; 엔드포인트는 /api/clips 로 가정)
export async function getClips({ page = 0, size = 3 } = {}) {
  const { data } = await api.get(`/api/clips/feed`, { params: { page, size } });
  const items = (data?.content || data || []).map((c) => ({
    id: c.clipId ?? c.id,
    src: toAbsoluteUrl(c.videoUrl),
    caption: c.caption ?? "",
    authorName: c.authorName ?? c.uploader?.nickname ?? "",
    uploaderId: c.uploaderId ?? c.uploader?.id ?? null,
    uploaderAvatarUrl: c.uploaderAvatarUrl ?? c.uploader?.avatarUrl ?? null,
    saved: Boolean(c.savedByMe ?? c.saved),
    liked: Boolean(c.likedByMe ?? c.liked),
    likeCount: c.likeCount,
    commentCount: c.commentCount,
    createdAt: c.createdAt,
    uploader: c.uploader ?? { id: c.uploaderId, nickname: c.authorName },
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements ?? items.length,
    last: data?.last ?? true,
  };
}

// 내가 팔로우 중인 사람들의 클립 (팔로잉 탭)
export async function getFollowingClips({ page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/me/following/clips`, {
    params: { page, size },
  });
  const items = (data?.content || []).map((c) => ({
    id: c.id,
    src: toAbsoluteUrl(c.videoUrl),
    caption: c.caption ?? "",
    authorName: c.authorName ?? "",
    uploaderId: c.authorId ?? null,
    uploaderAvatarUrl: c.authorAvatarUrl ?? null,
    saved: Boolean(c.savedByMe ?? c.saved),
    liked: Boolean(c.likedByMe ?? c.liked),
    likeCount: c.likeCount ?? 0,
    commentCount: c.commentCount ?? 0,
    createdAt: c.createdAt,
  }));
  return {
    items,
    pageable: data?.pageable ?? { page, size },
    totalElements: data?.totalElements ?? items.length,
    last: data?.last ?? true,
  };
}

// 공통: 클립 삭제
export async function deleteClip(clipId) {
  const { data } = await api.delete(`/api/clips/${clipId}`);
  return data;
}

// 공통: 캡션 수정
export async function updateClipCaption(clipId, { caption }) {
  // 백엔드가 인증 주체에서 memberId를 추출하므로 바디엔 caption만 보냅니다.
  const { data } = await api.patch(`/api/clips/${clipId}`, { caption });
  return data;
}

// 저장(북마크) 추가/취소
export async function saveClip(clipId) {
  const { data } = await api.post(`/api/clips/${clipId}/save`);
  return data; // { saved: true }
}

export async function unsaveClip(clipId) {
  const res = await api.delete(`/api/clips/${clipId}/save`);
  return res.status; // 204 expected
}
