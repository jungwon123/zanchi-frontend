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

export const activeTabState = atom({
  key: "activeTabState",
  default: "recommend", // 'recommend' | 'following'
});

export const commentsOpenState = atom({
  key: "commentsOpenState",
  default: false,
});

export const shareOpenState = atom({
  key: "shareOpenState",
  default: false,
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

export const uploadVideoUrlState = atom({
  key: "uploadVideoUrlState",
  default: "",
});

export const uploadCaptionState = atom({
  key: "uploadCaptionState",
  default: "",
});


