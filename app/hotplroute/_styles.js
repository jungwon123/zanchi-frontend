"use client";

import styled, { css } from "styled-components";

export const Screen = styled.div`
  min-height: 100svh;
  background: #fbfbfb;
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
  left: 12px;
  top: 12px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 0;
  background: transparent;
  font-size: 18px;
  color: #111;
  z-index: 10;
  background-image: url("/icon/back.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
`;

export const ClipBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 10px;
  width: 96px;
  height: 64px;
  border-radius: 20px;
  border: 0;
  background: transparent;
  background-image: url("/icon/goclip.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
`;

export const ClipImg = styled.button`
  position: absolute;
  right: 0px;
  top: 10px;

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
  width: 24px;
  height: 24px;
  background-image: url("/icon/clip.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const TitleCenter = styled.div`
  font-weight: 800;
  font-size: 22px;
`;

export const Main = styled.main`
  padding: 150px 16px 16px;
  ${(p) =>
    p.$center &&
    css`
      display: grid;
      justify-items: center;
    `}
`;

export const IntroText = styled.div`
  margin-top: 36px;
  text-align: center;
  line-height: 1.5;
  font-size: 18px;
  font-weight: 700;
`;

export const Illustration = styled.div`
  width: 280px; height: 280px; background-image: url('/images/hotplroute/ai.png'); background-repeat: no-repeat; background-position: center; background-size: contain; );
`;

export const BottomActions = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(16px + var(--safe-bottom));
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 16px;
  align-items: center;
`;

export const RoundBtn = styled.button`
  width: 96px;
  height: 64px;
  border-radius: 32px;
  border: 0;
  background: #ff8a00;
  color: #fff;
`;

export const CtaBtn = styled.button`
  width: 100%;
  height: 64px;
  border-radius: 32px;
  border: 0;
  background: #ff8a00;
  color: #fff;
  font-weight: 700;
`;

export const BottomBar = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(16px + var(--safe-bottom));
`;

// Loading overlay
export const LoaderWrap = styled.div`
  position: fixed;
  inset: 0;
  background: #fbfbfb;
  z-index: 200;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 24px;
  padding-top: 0;
`;
export const LoaderLogo = styled.div`
  font-weight: 900;
  font-size: 22px;
  color: #ff8a00;
`;
export const LoaderIcon = styled.div`
  width: 240px;
  height: 240px;
  background-image: url("/images/hotplroute/loading.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin-top: 150px;
`;
export const LoaderText = styled.div`
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #111;
`;

// Result screen
export const ResultWrap = styled.div`
  padding: 0 16px calc(100px + var(--safe-bottom));
  gap: 40px;
`;
export const ResultTop = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0 8px;
`;
export const DateText = styled.input`
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 20px;
  font-weight: 700;
  color: #111;
  width: 30%;
`;
export const EditBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  background-image: url("/icon/edit.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;
export const Places = styled.div`
  display: grid;
  gap: 24px;
  padding-top: 8px;
  grid-template-rows: repeat(4, 1fr);
  min-height: calc(100svh - 56px - 140px - var(--safe-bottom));
`;
export const PlaceItem = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr; /* timeline | content */
  gap: 16px;
  align-items: center;
  align-self: stretch;
  height: 100%;
`;
export const Thumb = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  background: #eee;
  overflow: hidden;
  background-size: cover;
  background-position: center;
`;
export const PlaceTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
`;
export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111;
  margin-bottom: 6px;
`;
export const Star = styled.span`
  color: #ff8a00;
  font-size: 22px;
  line-height: 1;
`;
export const AddrRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
`;
export const MarkerBadge = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  background: #ff8a00;
  color: #fff;
  font-weight: 800;
`;

export const AddrPin = styled.span`
  width: 18px;
  height: 18px;
  display: inline-block;
  background-image: url("/icon/point.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

// Result card container
export const PlaceCard = styled.div`
  border-radius: 12px;
  border: 0.5px solid var(--sub, #ffdab8);
  background: var(--W, #fbfbfb);
  display: flex;
  height: 100%;
  min-height: 113px;
  padding: 0 16px;
  align-items: center;
  gap: 11px;
  flex: 1 0 0;
`;

// Timeline for result items (left side)
export const TimelineCol = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
`;

export const TimelineWrap = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  justify-items: center;
`;

export const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  top: ${(p) => (p.$first ? "28px" : "-24px")};
  bottom: ${(p) => (p.$last ? "28px" : "-24px")};
  background: #ffdaba;
  border-radius: 6px;
`;

export const TimelineDot = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #ff7d0a;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 22px;
  z-index: 1;
`;

export const TimelineArrow = styled.div`
  width: 16px;
  height: 16px;
  border-left: 4px solid rgba(255, 125, 10, 0.7);
  border-bottom: 4px solid rgba(255, 125, 10, 0.7);
  transform: rotate(-45deg);
  margin-top: 8px;
`;
export const MapBox = styled.div`
  height: 300px;
  background: #f3f3f3;
  border-radius: 16px;
  margin-top: 16px;
  border: 1px solid #eee;
`;
export const BottomActionsRow = styled.div`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(16px + var(--safe-bottom));
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 16px;
  align-items: center;
`;

// Saves list
export const SavesWrap = styled.div`
  padding: 0 16px;
`;
export const SavesHeader = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin: 16px 0;
`;
export const SaveItem = styled.button`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 16px 0;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
`;
export const SaveIcon = styled.span`
  width: 28px;
  height: 28px;
  background-image: url("/icon/point.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  align-self: start;
`;
export const SaveTitle = styled.div`
  font-weight: 800;
  margin-bottom: 6px;
`;
export const SaveDesc = styled.div`
  color: #888;
`;

// Slide container
export const Slides = styled.div`
  position: relative;
  overflow: hidden;
  min-height: calc(100svh - 56px);
`;

export const Slide = styled.div`
  position: absolute;
  inset: 0;
  transition: transform 260ms ease;
  transform: translateX(
    ${(p) => (p.$active ? "0%" : p.$dir === "right" ? "100%" : "-100%")}
  );
`;

// Venue select
export const SectionTitle = styled.h2`
  text-align: center;
  margin: 40px 0 24px;
  font-size: 22px;
`;
export const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
`;
export const GhostBtn = styled.button`
  padding: 16px 0;
  border-radius: 20px;
  border: 1px solid
    ${(p) => (p.$active ? "#FF7D0A" : p.$mid ? "#FFDABA" : "#d0d0d0")};
  background: ${(p) => (p.$active ? "#FF7D0A" : p.$mid ? "#FFDABA" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#111")};
  font-size: 18px;
  font-weight: 600;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  &:hover {
    background: ${(p) => (p.$active ? "#FF7D0A" : p.$mid ? "#FFDABA" : "#fff")};
    color: ${(p) => (p.$active ? "#fff" : "#111")};
    border-color: ${(p) =>
      p.$active ? "#FF7D0A" : p.$mid ? "#FFDABA" : "#bdbdbd"};
  }
  &:active {
    background: #ff932f;
    color: #fff;
    border-color: #ff932f;
  }
`;

export const ButtonsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 8px;
`;

export const FourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 8px;
`;
