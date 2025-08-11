"use client";

import { useRecoilValue } from "recoil";
import { isMutedState } from "../../_state/atoms";
import useIntersectionAutoPlay from "../../_hooks/useIntersectionAutoPlay";
import HlsPlayer from "./HlsPlayer";
import RightActions from "./RightActions";
import BottomMeta from "./BottomMeta";
import { FeedItemWrap } from "./style";

export default function FeedItem({ index, src }) {
  const { elementRef, isInView } = useIntersectionAutoPlay({ threshold: 0.6 });
  const isMuted = useRecoilValue(isMutedState);

  return (
    <FeedItemWrap ref={elementRef}>
      <HlsPlayer src={src} autoPlay={isInView} muted={isMuted} />
      <RightActions likes={71100} comments={22} saves={999} shares={1205} />
      
      <BottomMeta profile={{ name: "노래하는 잔치러", following: false }} title="GOLDEN Covered by IVE ANYUJIN" desc="춤추는 잔치러 외 13명이 팔로우하고 있습니다." />
      
    </FeedItemWrap>
  );
}


