"use client";

import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isMutedState,
  commentsOpenState,
  myIdState,
  currentCommentsClipIdState,
} from "../../_state/atoms";
import useIntersectionAutoPlay from "../../_hooks/useIntersectionAutoPlay";
import HlsPlayer from "./HlsPlayer";
import RightActions from "./RightActions";
import BottomMeta from "./BottomMeta";
import { FeedItemWrap } from "./style";
import CommentsSheet from "./CommentsSheet";
import ShareSheet from "./ShareSheet";
import PostActionsSheet from "./PostActionsSheet";

export default function FeedItem({
  index,
  src,
  clipId,
  authorName = "사용자",
  caption = "",
  uploaderId = null,
  uploaderAvatarUrl = null,
  likes = 0,
  comments = 0,
  liked = false,
  savedInitial = false,
  isMine = false,
}) {
  const { elementRef, isInView } = useIntersectionAutoPlay({ threshold: 0.6 });
  const isMuted = useRecoilValue(isMutedState);
  const [commentsOpen, setCommentsOpen] = useRecoilState(commentsOpenState);
  const [currentCommentsClipId, setCurrentCommentsClipId] = useRecoilState(
    currentCommentsClipIdState
  );
  const myId = useRecoilValue(myIdState);
  const mine =
    isMine ||
    (myId != null && uploaderId != null && String(myId) === String(uploaderId));

  // 최근 본 클립 기록 (검색 페이지에서 사용)
  useEffect(() => {
    if (!isInView || !src || !clipId || !uploaderId) return;
    try {
      const key = "search_viewed";
      const item = { id: clipId, uploaderId, authorName, src };
      const raw = localStorage.getItem(key);
      const list = Array.isArray(JSON.parse(raw || "[]"))
        ? JSON.parse(raw || "[]")
        : [];
      const k = `${item.id}_${item.uploaderId}`;
      const next = [
        item,
        ...list.filter((x) => `${x.id}_${x.uploaderId}` !== k),
      ].slice(0, 12);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [isInView, src, clipId, uploaderId, authorName]);

  return (
    <FeedItemWrap ref={elementRef} $shrink={commentsOpen}>
      <HlsPlayer
        src={src}
        clipId={clipId}
        autoPlay={isInView}
        muted={isMuted}
      />
      <RightActions
        likes={likes}
        comments={comments}
        savesInitial={savedInitial}
        shares={0}
        likedInitial={liked}
        onOpenComments={() => {
          setCurrentCommentsClipId(clipId);
          setCommentsOpen(true);
        }}
        clipId={clipId}
      />
      <BottomMeta
        profile={{
          name: authorName,
          following: false,
          id: uploaderId,
          uploaderAvatarUrl,
        }}
        title={caption || ""}
        isMine={mine}
        clipId={clipId}
      />
      <CommentsSheet
        clipAuthor={authorName}
        clipId={currentCommentsClipId ?? clipId}
      />
      <ShareSheet />
      <PostActionsSheet isMine={mine} clipId={clipId} />
    </FeedItemWrap>
  );
}
