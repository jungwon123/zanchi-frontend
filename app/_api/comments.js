"use client";

import api from "@/app/_lib/axios";

// 댓글 목록 조회
export async function getComments(clipId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/clips/${clipId}/comments`, { params: { page, size } });
  const items = (data?.content || []).map((c) => ({
    id: c.commentId,
    author: c.author,
    content: c.content,
    createdAt: c.createdAt,
    likeCount: c.likeCount,
    replyCount: c.replyCount,
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements,
    last: data?.last,
  };
}

// 댓글 쓰기
export async function addComment(clipId, { content }) {
  const { data } = await api.post(`/api/clips/${clipId}/comments`, { content });
  return data;
}

// 대댓글 쓰기
export async function addReply(clipId, commentId, { content }) {
  const { data } = await api.post(`/api/clips/${clipId}/comments/${commentId}/replies`, { content });
  return data;
}

// 대댓글 목록 조회
export async function getReplies(clipId, commentId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/clips/${clipId}/comments/${commentId}/replies`, { params: { page, size } });
  const items = (data?.content || []).map((r) => ({
    id: r.commentId ?? r.id,
    author: r.author,
    content: r.content,
    createdAt: r.createdAt,
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements,
    last: data?.last,
  };
}


