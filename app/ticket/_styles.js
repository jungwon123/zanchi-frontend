"use client";

import styled from "styled-components";

export const Container = styled.div`
  background: #FBFBFB;
  color: #111;
  min-height: 100svh;
  padding-top: 96px;
  padding-bottom: calc(16px + var(--safe-bottom));
`;

export const HeroBox = styled.div`
  height: 340px;
  background: #ddd;
  display: grid;
  align-content: end;
  padding: 24px 16px;
  gap: 10px;
`;

export const Venue = styled.div`
  font-size: 14px;
  color: #f0f0f0;
`;

export const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-weight: 900;
  font-size: 28px;
  line-height: 1.24;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #eee;
  font-size: 16px;
`;

export const PriceSection = styled.section`
  padding: 16px 16px 8px;
  border-top: 1px solid #ffd6b3;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

export const PriceBig = styled.div`
  font-size: 32px;
  font-weight: 900;
`;

export const PriceSmall = styled.div`
  margin-top: 8px;
  color: #777;
`;

export const Dday = styled.div`
  color: #ff8a00;
  font-weight: 700;
`;

export const ActionWrap = styled.div`
  position: sticky;
  bottom: var(--safe-bottom);
  padding: 16px 16px;
  background: transparent;
`;

export const TabsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  padding: 12px 16px;
  place-items: center;
  background: var(--W, #FBFBFB);
  gap: 0;
  margin: 0 auto;
`;

export const TabButton = styled.button`
  background: none;
  border: 0;
  padding: 8px 0;
  font-size: 20px;
  font-weight: 800;
  color: ${(p) => (p.$active ? '#111' : '#777')};
  border-bottom: 2px solid ${(p) => (p.$active ? '#ff7d0a' : 'transparent')};
  width: 100%;
  text-align: center;
`;

export const TabContentHeader = styled.div`
  display: flex;
  padding: 24px 16px 12px 16px;
  align-items: center;
  gap: 100px;
  align-self: stretch;
  font-size: 20px;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.5px;
`;

export const GuideImage = styled.img`
  width: 100%;
  display: block;
`;

export const GuideDetails = styled.div`
  display: flex;
  width: 100%;
  padding: 48px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

export const GuideRow = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
`;

export const GuideBadge = styled.span`
  background: #ffdaba;
  color: #111;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 700;
  white-space: nowrap;
  margin-top: 2px;
`;

export const GuideDesc = styled.div`
  display: block;
  color: #111;
  line-height: 1.6;
`;

// Artist carousel
export const ArtistCarousel = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  gap: 16px;
  padding: 24px 16px 40px 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; 
  -ms-overflow-style: none; 
  &::-webkit-scrollbar 
    display: none;
  }
`;

export const ArtistCard = styled.button`
  flex: 0 0 72%;
  max-width: 280px;
  aspect-ratio: 3/4;
  border: 0;
  border-radius: 24px;
  background: #eee;
  position: relative;
  overflow: hidden;
  scroll-snap-align: center;
  transform: scale(1);
  opacity: 1;
  will-change: transform, opacity;
`;

export const CardVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CardCaption = styled.div`
  position: absolute;
  left: 12px; right: 12px; bottom: 12px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.5);
  font-weight: 800;
`;

export const GuideWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GuideInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 16px 16px;
  color: #333;
  font-size: 14px;
`;

export const GuideInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TopBar = styled.div`
  display: flex;
  width: 100%;
    height: 96px;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
`;

export const TopBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url(${(p)=> p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: contain;
`;

export const AssignBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url(${(p)=> p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: contain;
`;

export const TopTitle = styled.div`
  text-align: center; font-weight: 800; font-size: 18px;
`;

