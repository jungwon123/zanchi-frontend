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


