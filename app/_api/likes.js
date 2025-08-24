"use client";

import api from "@/app/_lib/axios";

// 좋아요 추가 (POST)
export async function likeClip(clipId) {
  const { data } = await api.post(`/api/clips/${clipId}/like`);
  return data; // { liked: true }
}

// 좋아요 취소 (DELETE)
export async function unlikeClip(clipId) {
  const res = await api.delete(`/api/clips/${clipId}/like`);
  return res.status; // 204 expected
}


