"use client";

import api from "@/app/_lib/axios";

// 댓글 목록 조회
export async function getComments(clipId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/clips/${clipId}/comments`, { params: { page, size } });
  const items = (data?.content || []).map((c) => ({
    id: c.commentId ?? c.id,
    author: c.author ? { ...c.author, avatarUrl: c.author?.avatarUrl ?? c.authorAvatarUrl } : (c.authorAvatarUrl ? { avatarUrl: c.authorAvatarUrl } : c.author),
    authorId: c.author?.id ?? c.authorId ?? null,
    authorName: c.author?.nickname ?? c.author?.name ?? c.authorName ?? c.author,
    content: c.content,
    createdAt: c.createdAt,
    likeCount: c.likeCount,
    replyCount: c.replyCount ?? c.commentCount,
    parentId: c.parentId,
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
  if (commentId == null || commentId === 'undefined') {
    throw new Error('Invalid commentId for getReplies');
  }
  const { data } = await api.get(`/api/clips/${clipId}/comments/${commentId}/replies`, { params: { page, size } });
  const items = (data?.content || []).map((r) => ({
    id: r.commentId ?? r.id,
    author: r.author ? { ...r.author, avatarUrl: r.author?.avatarUrl ?? r.authorAvatarUrl } : (r.authorAvatarUrl ? { avatarUrl: r.authorAvatarUrl } : r.author),
    authorId: r.author?.id ?? r.authorId ?? null,
    authorName: r.author?.nickname ?? r.author?.name ?? r.authorName ?? r.author,
    content: r.content,
    createdAt: r.createdAt,
    parentId: r.parentId,
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements,
    last: data?.last,
  };
}


