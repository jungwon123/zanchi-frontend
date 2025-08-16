"use client";

import React from "react";
import styled from "styled-components";


const GalleryRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  width: 100%;
  padding: 12px;
  height: 250px;

  overflow: hidden; /* 가로 넘침 방지 */
`;

const GalleryMain = styled.button`
  flex: 1 1 0;
  min-width: 0; /* Flex 최소 콘텐츠 폭으로 인한 넘침 방지 */
  aspect-ratio: 16/9;
  border: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #ddd;
`;

const SideCol = styled.div`
  flex: 0 0 96px;
  width: 100%;
  display: flex;
  
  flex-direction: column;
  gap: 12px;
`;

const GalleryThumb = styled.button`
  width: 96px;
  height: 100%;
  border: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #e9e9e9;
  position: relative;
`;

const MoreBadge = styled.div`
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: rgba(0,0,0,.4);
  color: #fff; font-weight: 800; font-size: 20px;
`;

const PopupDim = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.55);
  display: ${(p)=> (p.$open ? 'flex' : 'none')};
  align-items: center; justify-content: center;
`;

const PopupBody = styled.div`
  width: min(100%, 420px);
  height: min(80vh, 640px);
  background: #000; color: #fff;
  border-radius: 16px; overflow: hidden;
  display: grid; grid-template-rows: 1fr 96px;
`;

const PopupMain = styled.div`
  position: relative;
`;

const PopupImage = styled.img`
  width: 100%; height: 100%; object-fit: contain; background: #000;
`;

const PopupThumbs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px;
  background: #111;
  height: 72px; /* 썸네일 높이와 동일 영역 확보 */
  align-items: center;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
`;

const PopupThumb = styled.button`
  flex: 0 0 96px;
  width: 96px; height: 60px; border: 0; border-radius: 12px;  background: #222;
  scroll-snap-align: start;
  outline: ${(p)=> (p.$active ? '2px solid #ff7d0a' : 'none')};
`;

const CloseBtn = styled.button`
  position: absolute; right: 8px; top: 8px; border: 0; width: 36px; height: 36px; border-radius: 18px;
  background: rgba(0,0,0,.6); color: #fff; font-weight: 800;
`;

export default function Gallery({ photos = [] }) {
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const openAt = (idx) => {
    setActiveIdx(idx);
    setOpen(true);
  };

  const list = Array.isArray(photos) ? photos.slice(0, 10) : [];
  if (list.length === 0) return null;

  const thumbCount = Math.min(3, list.length - 1); // 메인 제외 최대 3개
  const extraCount = Math.max(0, list.length - 4); // 표시되지 않는 나머지 개수

  return (
    <>
        <GalleryRow>
          <GalleryMain onClick={() => openAt(0)}>
            <img src={list[0]} alt="gallery-main" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </GalleryMain>
          <SideCol>
            {Array.from({ length: thumbCount }).map((_, i) => {
              const idx = i + 1;
              const isLastThumb = i === thumbCount - 1 && extraCount > 0; // 세 번째에 +N
              return (
                <GalleryThumb key={idx} onClick={() => openAt(idx)}>
                  <img src={list[idx]} alt={`gallery-thumb-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {isLastThumb && <MoreBadge>+{extraCount}</MoreBadge>}
                </GalleryThumb>
              );
            })}
          </SideCol>
        </GalleryRow>

      <PopupDim $open={open} onClick={() => setOpen(false)}>
        <PopupBody onClick={(e) => e.stopPropagation()}>
          <PopupMain>
            <CloseBtn onClick={() => setOpen(false)}>×</CloseBtn>
            <PopupImage src={list[activeIdx]} alt={`photo-${activeIdx}`} />
          </PopupMain>
          <PopupThumbs>
            {list.map((src, i) => (
              <PopupThumb key={i} $active={i === activeIdx} onClick={() => setActiveIdx(i)}>
                <img src={src} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </PopupThumb>
            ))}
          </PopupThumbs>
        </PopupBody>
      </PopupDim>
    </>
  );
}


