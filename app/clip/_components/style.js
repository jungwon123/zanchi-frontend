import styled, { css } from "styled-components";

// Common wrappers
export const FeedItemWrap = styled.div`
  height: 100svh;
  min-height: 100svh;
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  position: relative;
`;

export const VideoTag = styled.video`
  width: 100%;
  height: 100%;
  background: #000;
`;

// Header
export const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center; /* 탭을 정확히 가운데로 */
  padding: 0 16px;
  z-index: 20;
  background: transparent;
`;
export const HeaderTabs = styled.div`
  display: flex;
  gap: 12px;
`;
export const HeaderActions = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 16px;
`;
export const TabButton = styled.button`
  font-weight: 700;
  ${(p) => (p.$active ? css`color: #fff;` : css`color: #aaa;`)}
`;
export const IconButton = styled.button``;

// Right actions
export const ActionsWrap = styled.div`
  position: absolute;
  right: 12px;
  top: 40%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const ActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;
export const ActionButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.1);
`;
export const ActionCount = styled.span`
  font-size: 12px;
  color: #ddd;
`;

// Bottom meta
export const MetaWrap = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 84px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;
export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #666;
`;
export const MetaTextWrap = styled.div`
  flex: 1;
  min-width: 0;
`;
export const MetaHeaderRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;
export const FollowBadge = styled.span`
  font-size: 12px;
  color: #0af;
  border: 1px solid #0af;
  border-radius: 6px;
  padding: 2px 6px;
`;
export const MetaTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;
export const MetaDesc = styled.div`
  color: #ccc;
  font-size: 13px;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// Bottom nav
export const BottomNavBar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  background: rgba(0,0,0,.8);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  z-index: 20;
`;
export const NavButton = styled.button`
  ${(p) => (p.$active ? css`color: #fff;` : css`color: #aaa;`)}
`;

