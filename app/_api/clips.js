"use client";

import api from "@/app/_lib/axios";

// 공통: 클립 업로드 (multipart/form-data)
export async function uploadClip({ file, caption }) {
  const form = new FormData();
  if (file) form.append("video", file);
  if (caption != null) form.append("caption", caption);
  const { data } = await api.post("/api/clips", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// 공통: 클립 피드 조회
export async function getClipsFeed({ page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/clips/feed`, { params: { page, size } });
  const items = (data?.content || []).map((c) => ({
    id: c.clipId,
    src: c.videoUrl,
    caption: c.caption,
    likeCount: c.likeCount,
    commentCount: c.commentCount,
    createdAt: c.createdAt,
    uploader: c.uploader,
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements,
    last: data?.last,
  };
}

// 클립 전체 조회(피드가 아닌 모든 클립 리스트; 엔드포인트는 /api/clips 로 가정)
export async function getClips({ page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/clips/feed`, { params: { page, size } });
  const items = (data?.content || data || []).map((c) => ({
    id: c.clipId ?? c.id,
    src: c.videoUrl,
    caption: c.caption,
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

// 공통: 클립 삭제
export async function deleteClip(clipId) {
  const { data } = await api.delete(`/api/clips/${clipId}`);
  return data;
}

// 공통: 캡션 수정
export async function updateClipCaption(clipId, { caption }) {
  const { data } = await api.put(`/api/clips/${clipId}`, { caption });
  return data;
}


