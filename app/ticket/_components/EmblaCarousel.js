"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getRankingClips } from "@/app/_api/ranking";

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Slides = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 16px 40px 16px;
`;

const Slide = styled.div`
  flex: 0 0 72%;
  max-width: 280px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: transparent;
`;

const SlideInner = styled.button`
  width: 100%;
  aspect-ratio: 3/4;
  border: 0;
  padding: 0;
  border-radius: 24px;
  overflow: hidden;
  background: #000;
  transform: scale(1);
  transform-origin: center center;
  opacity: 1;
  will-change: transform, opacity;
  transition: transform 260ms ease, opacity 260ms ease;
  cursor: pointer;
`;

const SlideVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CaptionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;
  padding: 0 4px;
  transform: scale(1);
  opacity: 1;
  will-change: transform, opacity;
  transition: transform 260ms ease, opacity 260ms ease;
`;

const CaptionTitle = styled.div`
  font-weight: 800;
  font-size: 16px;
  color: #111;
`;

const CaptionDesc = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #555;
  line-height: 1.4;
`;

export default function EmblaCarousel({ items }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const viewportRef = emblaRef;

  // 랭킹 API에서 상위 10개(좋아요 내림차순) 영상/닉네임을 가져와 사용
  const { data: rankingData } = useQuery({
    queryKey: ['ranking-for-ticket', 0],
    queryFn: () => getRankingClips({ page: 0, size: 30 }),
    staleTime: 60_000,
  });
  const rankingItems = React.useMemo(() => {
    const arr = Array.isArray(rankingData?.items) ? rankingData.items.slice() : [];
    return arr.sort((a,b) => (b.score||0) - (a.score||0)).slice(0, 10).map((r, idx) => ({
      id: idx + 1,
      videoUrl: r.src,
      uploaderName: r.name,
      clipId: r.clipId,
      uploaderId: r.uploaderId,
      caption: r.caption, // 제목으로 사용할 캡션
      title: r.name,
      thumb: '/images/ticket/question.png',
    }));
  }, [rankingData?.items]);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      // 초기 위치: id === 1 인덱스로 이동
      const indexOfOne = items.findIndex((it) => it.id === 1);
      if (indexOfOne >= 0) emblaApi.scrollTo(indexOfOne, true);
      applyEffects();
    };

    const applyEffects = () => {
      const root = emblaApi.rootNode();
      const rect = root.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const slideNodes = emblaApi.slideNodes();
      for (const slide of slideNodes) {
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const dist = Math.abs(centerX - slideCenter);
        const t = Math.min(1, dist / (rect.width / 2));
        const scale = 1 - 0.2 * t;
        const opacity = 1 - 0.5 * t;
        const inner = slide.querySelector('[data-inner="1"]');
        if (inner) {
          inner.style.transform = `scale(${scale})`;
          inner.style.opacity = String(opacity);
          inner.style.zIndex = scale > 0.98 ? '2' : '1';
        }
        const caption = slide.querySelector('[data-caption="1"]');
        if (caption) {
          caption.style.transform = `scale(${scale})`;
          caption.style.opacity = String(opacity);
        }
      }
    };

    emblaApi.on("init", onInit);
    emblaApi.on("reInit", onInit);
    emblaApi.on("scroll", applyEffects);
    emblaApi.on("select", applyEffects);

    // 초기에도 호출 (emblaApi가 이미 init 되었을 수 있음)
    onInit();

    return () => {
      emblaApi.off("init", onInit);
      emblaApi.off("reInit", onInit);
      emblaApi.off("scroll", applyEffects);
      emblaApi.off("select", applyEffects);
    };
  }, [emblaApi, items]);

  return (
    <Viewport ref={viewportRef}>
      <Slides>
        {(rankingItems.length ? rankingItems : items).map((it) => (
          <Slide key={it.id}>
            <SlideInner data-inner="1" onClick={() => { 
              if (it?.clipId && it?.uploaderId) {
                window.location.href = `/clip/view?userId=${it.uploaderId}&clipId=${it.clipId}`;
              } else {
                window.location.href = "/clip";
              }
            }}>
              <SlideVideo src={it.videoUrl || ""} poster={it.thumb} muted playsInline autoPlay />
            </SlideInner>
            <CaptionBox data-caption="1">
              <CaptionTitle>@{it.uploaderName || ''}</CaptionTitle>
              <CaptionDesc>{it.caption || `무제`}</CaptionDesc>
            </CaptionBox>
          </Slide>
        ))}
      </Slides>
    </Viewport>
  );
}


