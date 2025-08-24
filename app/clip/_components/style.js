import styled, { css } from "styled-components";

// Common wrappers
export const FeedItemWrap = styled.div`
  height: ${(p) => (p.$shrink ? 'calc(100svh - var(--sheet-h, 0px) - 44px)' : '100svh')};
  min-height: 100svh;
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  margin-top: ${(p) => (p.$shrink ? '44px' : '0')};
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
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center; 
  padding: 0 16px;
  z-index: 20;
  background: transparent;
`;
export const HeaderTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  gap: 14px;
`;
export const HeaderActions = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 16px;
`;
export const HeaderLeft = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 12px;
`;
export const TabButton = styled.button`
  font-weight: 300;
  font-size: 12px; 
  width: 40%;
  border-radius: 999px;
  padding: 2px 0;
  border: 1px solid transparent;
  transition: all 160ms ease;
  ${(p) => (p.$active
    ? css`
        color: #fff;
        background: rgba(255, 255, 255, 0.18); 
      `
    : css`
        color: #aaa;
        background: transparent;
        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.16);
        }
      `)}
`;
export const IconButton = styled.button`
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

// Right actions
export const ActionsWrap = styled.div`
  position: absolute;
  right: 12px;
  top: 35%;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  background-image: url(${(p) => p.$src || "none"});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 44px 44px;
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
  bottom: calc(84px + var(--safe-bottom));
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
  padding-bottom: var(--safe-bottom);
  background: rgba(0,0,0,.8);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  z-index: 20;
`;

// Bottom sheet (comments)
export const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity 200ms ease;
`;
export const SheetWrap = styled.div`
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: ${(p) => (p.$open ? 'var(--sheet-h, 170px)' : '0')};
  background: #fff;
  color: #000;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  transition: height 220ms ease;
  overflow: hidden;
  z-index: 100;

`;
export const SheetHeader = styled.div`
  padding: 12px 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 20px;
`;
export const SheetHandle = styled.div`
  width: 68px; height: 5px; background: #ccc; border-radius: 3px; justify-self: center;
`;
export const SheetTitle = styled.div`
  grid-column: 2 / 3; text-align: center; font-weight: 700;
`;
export const SheetBody = styled.div`
  height: calc(100% - 52px);
  overflow: auto;
  padding: 8px 16px calc(84px + var(--safe-bottom));
`;

// Share sheet
export const ShareWrap = styled(SheetWrap)``;
export const ShareBody = styled.div`
  padding: 24px 16px calc(32px + var(--safe-bottom));
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; justify-items: center; align-items: start;
`;
export const ShareItem = styled.button`
  background: none; border: 0; display: grid; gap: 12px; justify-items: center; color: #111;
`;
export const ShareIcon = styled.div`
  width: 74px; height: 74px;
  background-image: url(${(p) => p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: 74px 74px;
`;
export const CommentItem = styled.div`
  display: grid; grid-template-columns: 36px 1fr; gap: 10px; padding: 10px 0;
  background: ${(p) => (p.$highlight ? '#E5E5E5' : 'transparent')};
`;
export const CommentMeta = styled.div`
  font-size: 12px; color: #666; margin-bottom: 6px;
`;
export const ReplyLink = styled.button`
  background: none; border: 0; color: #0a84ff; font-size: 12px; padding: 0; margin-top: 6px; cursor: pointer;
`;
export const MoreRepliesLink = styled.button`
  background: none; border: 0; color: #666; font-size: 12px; padding: 0; margin-top: 6px; cursor: pointer;
`;
export const RepliesBlock = styled.div`
  margin-left: 40px; /* 사양 7: 40px 안쪽 들여쓰기 */
`;
export const SheetInputBar = styled.div`
  position: absolute; left: 0; right: 0; bottom: var(--safe-bottom); height: 64px; background: #fff; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-top: 1px solid #eee;
`;
export const InputWrapper = styled.div`
  position: relative; flex: 1; height: 44px;
`;
export const InputField = styled.input`
  width: 100%; height: 100%; border-radius: 22px; border: 1px solid #eee; padding: 0 48px 0 14px; outline: none; font-size: 14px;
`;
export const SendButton = styled.button`
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  width: 44px; height: 30px; border: 0; border-radius: 16px; background: transparent;
  opacity: ${(p) => (p.$enabled ? 1 : 0.4)};
  background-image: url(${(p) => p.$src || "none"});
  background-repeat: no-repeat; background-position: center; background-size: 44px 30px;
  cursor: ${(p) => (p.$enabled ? 'pointer' : 'default')};
`;
export const NavButton = styled.button`
  display: grid;
  place-items: center;
  gap: 6px;
  color: ${(p) => (p.$active ? '#fff' : '#aaa')};
`;
export const NavIcon = styled.span`
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url(${(p) => p.$src || 'none'});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

// Post actions sheet (신고 등)
export const ActionsSheetWrap = styled(SheetWrap)``;
export const ActionsList = styled.div`
  padding: 16px;
  display: grid;
  gap: 12px;
`;
export const ActionRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 12px;
  border-radius: 14px;
  border: 1px solid ${(p) => (p.$danger ? '#ff8a00' : '#9b9b9b')};
  color: ${(p) => (p.$danger ? '#ff8a00' : '#7a7a7a')};
  background: #fff;
  &:active { background-color: #e5e5e5; }
`;
export const RowIcon = styled.span`
  width: 28px; height: 28px;
  background-image: url(${(p) => p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: contain;
`;

// Report categories
export const CategoryList = styled.div`
  margin-top: 4px;
  background: #fff;
`;
export const CategoryRow = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 12px;
  border: 0;
  background: #fff;
  color: #111;
  border-bottom: 1px solid #eee;
  &:active { background-color: #e5e5e5; }
`;

