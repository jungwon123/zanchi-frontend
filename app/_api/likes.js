"use client";

import api from "@/app/_lib/axios";

// 좋아요 토글 (예상: POST 혹은 PUT, 여기선 POST 사용)
export async function toggleLike(clipId) {
  const { data } = await api.post(`/api/clips/${clipId}/like`);
  return data; // { liked: true|false }
}


