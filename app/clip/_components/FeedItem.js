"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { isMutedState, commentsOpenState } from "../../_state/atoms";
import useIntersectionAutoPlay from "../../_hooks/useIntersectionAutoPlay";
import HlsPlayer from "./HlsPlayer";
import RightActions from "./RightActions";
import BottomMeta from "./BottomMeta";
import { FeedItemWrap } from "./style";
import CommentsSheet from "./CommentsSheet";
import ShareSheet from "./ShareSheet";

export default function FeedItem({ index, src, clipId }) {
  const { elementRef, isInView } = useIntersectionAutoPlay({ threshold: 0.6 });
  const isMuted = useRecoilValue(isMutedState);
  const [commentsOpen, setCommentsOpen] = useRecoilState(commentsOpenState);

  return (
    <FeedItemWrap ref={elementRef} $shrink={commentsOpen}>
      <HlsPlayer src={src} autoPlay={isInView} muted={isMuted} />
      <RightActions likes={71100} comments={22} saves={999} shares={1205} onOpenComments={() => setCommentsOpen(true)} clipId={clipId} />
      <BottomMeta profile={{ name: "노래하는 잔치러", following: false }} title="GOLDEN Covered by IVE ANYUJIN" desc="춤추는 잔치러 외 13명이 팔로우하고 있습니다." />
      <CommentsSheet clipAuthor="노래하는 잔치러" clipId={clipId} />
      <ShareSheet />
    </FeedItemWrap>
  );
}


