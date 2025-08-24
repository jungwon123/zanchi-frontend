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

// 내 프로필 요약
export async function getMySummary() {
  const { data } = await api.get('/api/me/summary');
  return data; // { id, name, loginId, avatarUrl }
}

// 특정 멤버 요약
export async function getMemberSummary(userId) {
  const { data } = await api.get(`/api/members/${userId}/summary`);
  return data; // { id, name, loginId, avatarUrl }
}

// 특정 멤버 팔로우/팔로우 해제 토글 (서버 정책에 따름)
export async function toggleFollow(memberId) {
  const { data } = await api.post(`/api/members/${memberId}/follow`);
  return data; // { following, followerCount, followingCount }
}

// 언팔로우 (팔로우 관계 제거)
export async function unfollow(memberId) {
  const { data } = await api.delete(`/api/members/${memberId}/follow`);
  return data; // { following:false, followerCount, followingCount }
}

// 팔로우/팔로잉/게시물 수 조회
export async function getFollowCounts(userId) {
  const { data } = await api.get(`/api/members/${userId}/follow-counts`);
  return data; // { posts, followers, following }
}

// 내 클립 목록
export async function getMyClips({ page = 0, size = 50 } = {}) {
  const { data } = await api.get('/api/me/clips', { params: { page, size } });
  return data;
}

// 특정 유저 클립 목록
export async function getMemberClips(userId, { page = 0, size = 50 } = {}) {
  const { data } = await api.get(`/api/members/${userId}/clips`, { params: { page, size } });
  return data;
}

// 아바타 업로드
export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/api/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data; // { avatarUrl }
}

// 관계 상태 조회
export async function getRelation(targetId) {
  const { data } = await api.get(`/api/members/${targetId}/relation`);
  return data; // { following }
}

// 팔로워/팔로잉 목록 (검색어 포함)
export async function getFollowers(userId, { page = 0, size = 20, q = '' } = {}) {
  const { data } = await api.get(`/api/members/${userId}/followers`, { params: { page, size, q } });
  return data;
}
export async function getFollowing(userId, { page = 0, size = 20, q = '' } = {}) {
  const { data } = await api.get(`/api/members/${userId}/following`, { params: { page, size, q } });
  return data;
}

// 표시명 수정
export async function updateName(name) {
  const { data } = await api.put('/api/name', { name });
  return data; // { id, name }
}

// 저장한 클립
export async function getSavedClips({ page = 0, size = 50 } = {}) {
  const { data } = await api.get('/api/me/saved', { params: { page, size } });
  return data;
}

// 나의 잔치픽(좋아요한 클립)
export async function getPickedClips({ page = 0, size = 50 } = {}) {
  const { data } = await api.get('/api/me/picks', { params: { page, size } });
  return data;
}


// 특정 유저 클립 목록 (매핑된 형태)
export async function getMemberClipsList(userId, { page = 0, size = 50 } = {}) {
  const { data } = await api.get(`/api/members/${userId}/clips`, { params: { page, size } });
  const items = (data?.content || []).map((c) => ({
    id: c.id,
    src: toAbsoluteUrl(c.videoUrl),
    caption: c.caption ?? "",
    likeCount: c.likeCount ?? 0,
    commentCount: c.commentCount ?? 0,
    viewCount: c.viewCount ?? 0,
    authorName: c.authorName ?? "",
    uploaderId: c.uploaderId ?? null,
    createdAt: c.createdAt,
    liked: Boolean(c.likedByMe ?? c.liked),
    saved: Boolean(c.savedByMe ?? c.saved),
  }));
  return {
    items,
    pageable: data?.pageable,
    totalElements: data?.totalElements,
    last: data?.last,
  };
}
