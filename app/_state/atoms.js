"use client";

import { atom } from "recoil";

export const currentFeedIndexState = atom({
  key: "currentFeedIndexState",
  default: 0,
});

export const isMutedState = atom({
  key: "isMutedState",
  default: true,
});

export const userState = atom({
  key: "userState",
  default: null,
});

// 로그인 여부/토큰
export const authTokenState = atom({
  key: 'authTokenState',
  default: typeof window !== 'undefined' ? (() => {
    const t = localStorage.getItem('auth_token');
    return (t && t !== 'undefined' && t !== 'null') ? t : '';
  })() : '',
});

// 내 userId만 전역에 두고, 내 클립 여부는 각 컴포넌트에서 uploaderId와 비교하여 계산
export const myIdState = atom({
  key: 'myIdState',
  default: typeof window !== 'undefined' ? (() => {
    try { return JSON.parse(localStorage.getItem('auth_member') || '{}').id || null; } catch { return null; }
  })() : null,
});

export const activeTabState = atom({
  key: "activeTabState",
  default: "recommend", // 'recommend' | 'following'
});

export const commentsOpenState = atom({
  key: "commentsOpenState",
  default: false,
});

// 현재 댓글 시트가 보여줄 클립 ID
export const currentCommentsClipIdState = atom({
  key: 'currentCommentsClipIdState',
  default: null,
});

export const shareOpenState = atom({
  key: "shareOpenState",
  default: false,
});

// 게시물 더보기(신고 등) 시트 오픈 상태
export const postActionsOpenState = atom({
  key: "postActionsOpenState",
  default: false,
});

// 게시물 더보기 시트 컨텍스트: open 여부와 대상 업로더/클립
export const postActionsState = atom({
  key: 'postActionsState',
  default: { open: false, uploaderId: null, clipId: null },
});

export const notificationsState = atom({
  key: "notificationsState",
  default: [
    { id: 'n1', type: 'like', user: 'zanchi', message: '님이 회원님의 클립을 픽했습니다', ts: Date.now() - 3600*1000 },
    { id: 'n2', type: 'follow', user: 'zanchi', message: '님이 회원님을 팔로우했습니다', ts: Date.now() - 7200*1000 },
    { id: 'n3', type: 'comment', user: 'zanchi', message: '님이 회원님의 클립에 댓글을 남겼습니다', ts: Date.now() - 86400*1000 },
    { id: 'n4', type: 'reply', user: 'zanchi', message: '님이 회원님의 댓글에 답글을 남겼습니다', ts: Date.now() - 86400*1000 * 2 },
  ],
});

// 전역 토스트 큐 (간단 문자열 큐)
export const toastQueueState = atom({
  key: 'toastQueueState',
  default: [],
});

export const uploadVideoUrlState = atom({
  key: "uploadVideoUrlState",
  default: "",
});

export const uploadCaptionState = atom({
  key: "uploadCaptionState",
  default: "",
});

// 업로드 중 선택한 파일(File 객체) - 라우트 전환 후에도 유지
export const uploadFileState = atom({
  key: 'uploadFileState',
  default: null,
});


