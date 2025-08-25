"use client";

import styled, { css } from "styled-components";

export const Screen = styled.div`
  min-height: 100svh;
  background: #FBFBFB;
  color: #111;
`;

export const TopBar = styled.div`
  height: 56px;
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;
`;

export const BackBtn = styled.button`
  position: absolute;
  left: 12px; top: 12px;
  width: 32px; height: 32px; border-radius: 16px; border: 0; background: none; font-size: 18px;
`;

export const ClipBtn = styled.button`
  position: absolute; right: 16px; top: 10px;
  width: 96px; height: 64px; border-radius: 20px; border: 0;
  background: transparent;
  background-image: url('/icon/goclip.png');
  background-repeat: no-repeat; background-position: center; background-size: contain;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
`;


export const ClipImg = styled.button`
  position: absolute; right: 0px; top: 10px;

  width: 42px;
  height: 58px;
  border: 0;
  padding: 0;
  background-color: transparent;
  background-image: url(${(p) => p.$src || "none"});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: pointer;
`;

export const ClipIcon = styled.span`
  width: 24px; height: 24px; background-image: url('/icon/clip.png'); background-repeat: no-repeat; background-position: center; background-size: contain;
`;

export const TitleCenter = styled.div`
  font-weight: 800; font-size: 22px;
`;

export const Main = styled.main`
  padding: 150px 16px 16px;
  ${(p) => p.$center && css`display: grid; justify-items: center;`}
`;

export const IntroText = styled.div`
  margin-top: 36px; text-align: center; line-height: 1.5;
  font-size: 18px; font-weight: 700;
`;

export const Illustration = styled.div`
  width: 280px; height: 280px; background-image: url('/images/hotplroute/ai.png'); background-repeat: no-repeat; background-position: center; background-size: contain; );
`;

export const BottomActions = styled.div`
  position: fixed; left: 16px; right: 16px; bottom: calc(16px + var(--safe-bottom)); display: grid; grid-template-columns: 96px 1fr; gap: 16px; align-items: center;
`;

export const RoundBtn = styled.button`
  width: 96px; height: 64px; border-radius: 32px; border: 0; background: #ff8a00; color: #fff;
`;

export const CtaBtn = styled.button`
  width: 100%; height: 64px; border-radius: 32px; border: 0; background: #ff8a00; color: #fff; font-weight: 700;
`;

export const BottomBar = styled.div`
  position: fixed; left: 16px; right: 16px; bottom: calc(16px + var(--safe-bottom));
`;

// Loading overlay
export const LoaderWrap = styled.div`
  position: fixed; inset: 0; background: #fbfbfb; z-index: 200;
  display: grid; align-content: start; justify-items: center; gap: 24px; padding-top: 0;
`;
export const LoaderLogo = styled.div`
  font-weight: 900; font-size: 22px; color: #ff8a00;
`;
export const LoaderIcon = styled.div`
  width: 120px; height: 120px; background-image: url('/images/hotplroute/loading.png'); background-repeat: no-repeat; background-position: center; background-size: contain; margin-top: 24px;
`;
export const LoaderText = styled.div`
  margin-top: 12px; font-size: 18px; font-weight: 600; text-align: center; color: #111;
`;

// Result screen
export const ResultWrap = styled.div`
  padding: 0 16px calc(100px + var(--safe-bottom));
`;
export const ResultTop = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 8px;
`;
export const DateText = styled.input`
  border: 0; background: transparent; text-align: left; font-size: 20px; font-weight: 700; color: #111; width: 160px;
`;
export const EditBtn = styled.button`
  width: 24px; height: 24px; border: 0; background: transparent; background-image: url('/icon/edit.png'); background-repeat: no-repeat; background-position: center; background-size: contain;
`;
export const Places = styled.div`
  display: grid; gap: 24px; padding-top: 8px;
`;
export const PlaceItem = styled.div`
  display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;
`;
export const Thumb = styled.div`
  width: 120px; height: 120px; border-radius: 12px; background: #eee; overflow: hidden; background-size: cover; background-position: center;
`;
export const PlaceTitle = styled.div`
  font-size: 22px; font-weight: 800; margin-bottom: 8px;
`;
export const RatingRow = styled.div`
  display: flex; align-items: center; gap: 8px; color: #111; margin-bottom: 6px;
`;
export const Star = styled.span`
  color: #ff8a00; font-size: 22px; line-height: 1;
`;
export const AddrRow = styled.div`
  display: flex; align-items: center; gap: 10px; color: #666;
`;
export const MarkerBadge = styled.span`
  width: 24px; height: 24px; border-radius: 12px; display: inline-grid; place-items: center; background: #ff8a00; color: #fff; font-weight: 800;
`;
export const MapBox = styled.div`
  height: 300px; background: #f3f3f3; border-radius: 16px; margin-top: 16px; border: 1px solid #eee;
`;
export const BottomActionsRow = styled.div`
  position: fixed; left: 16px; right: 16px; bottom: calc(16px + var(--safe-bottom)); display: grid; grid-template-columns: 96px 1fr; gap: 16px; align-items: center;
`;

// Saves list
export const SavesWrap = styled.div`
  padding: 0 16px;
`;
export const SavesHeader = styled.h2`
  font-size: 24px; font-weight: 800; margin: 16px 0;
`;
export const SaveItem = styled.button`
  display: grid; grid-template-columns: 28px 1fr; gap: 12px; width: 100%; border: 0; background: transparent; padding: 16px 0; text-align: left; border-bottom: 1px solid #f1f1f1;
`;
export const SaveIcon = styled.span`
  width: 28px; height: 28px; background-image: url('/icon/point.png'); background-repeat: no-repeat; background-position: center; background-size: contain; align-self: start;
`;
export const SaveTitle = styled.div`
  font-weight: 800; margin-bottom: 6px;
`;
export const SaveDesc = styled.div`
  color: #888;
`;

// Slide container
export const Slides = styled.div`
  position: relative; overflow: hidden; min-height: calc(100svh - 56px);
`;

export const Slide = styled.div`
  position: absolute; inset: 0; transition: transform 260ms ease;
  transform: translateX(${(p) => (p.$active ? '0%' : p.$dir === 'right' ? '100%' : '-100%')});
`;

// Venue select
export const SectionTitle = styled.h2`
  text-align: center; margin: 40px 0 24px; font-size: 22px;
`;
export const TwoCols = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px;
`;
export const GhostBtn = styled.button`
  padding: 16px 0; border-radius: 20px; border: 1px solid ${(p) => (p.$active ? '#FF7D0A' : p.$mid ? '#FFDABA' : '#d0d0d0')};
  background: ${(p) => (p.$active ? '#FF7D0A' : p.$mid ? '#FFDABA' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#111')};
  font-size: 18px; font-weight: 600;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  &:hover { 
    background: ${(p) => (p.$active ? '#FF7D0A' : p.$mid ? '#FFDABA' : '#fff')};
    color: ${(p) => (p.$active ? '#fff' : '#111')};
    border-color: ${(p) => (p.$active ? '#FF7D0A' : p.$mid ? '#FFDABA' : '#bdbdbd')};
  }
  &:active { background: #FF932F; color: #fff; border-color: #FF932F; }
`;

export const ButtonsRow = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 8px;
`;

export const FourGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 8px;
`;


