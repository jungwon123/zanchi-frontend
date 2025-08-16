"use client";

import styled from "styled-components";

export const Container = styled.div`
  min-height: 100svh; background: #fff; color: #111;
`;
export const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; padding: 12px 16px;
`;
export const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url('/icon/back.png'); background-size: 24px 24px; background-position: center; background-repeat: no-repeat;
`;
export const Title = styled.div`
  font-weight: 700; font-size: 18px;
`;
export const ConfirmBtn = styled.button`
  background: none; border: 0; color: #ff8a00; font-weight: 700; font-size: 16px;
`;

export const VideoBox = styled.div`
  margin: 12px 16px; border-radius: 16px; background: #b0b0b7; overflow: hidden; position: relative;
  aspect-ratio: 9/16; display: grid; place-items: center;
`;
export const VideoTag = styled.video`
  width: 100%; height: 100%; object-fit: cover; background: #000;
`;
export const EditBadge = styled.button`
  position: absolute; right: 10px; bottom: 10px; width: 36px; height: 36px; border-radius: 18px; border: 1px solid #fff3;
  background: rgba(0,0,0,.4); color: #fff; display: grid; place-items: center;
`;

export const CaptionWrap = styled.div`
  padding: 0 16px; margin-top: 8px;
`;
export const CaptionLabel = styled.div`
  font-weight: 700; margin-bottom: 8px;
`;
export const CaptionInput = styled.textarea`
  width: 100%; min-height: 120px; border: none; outline: none; resize: none; font-size: 16px; color: #111;
`;
export const CaptionPreview = styled.div`
  margin-top: 6px; white-space: pre-wrap; color: #111; font-size: 16px;
`;

export const Suggestions = styled.div`
  border-top: 1px solid #eee; max-height: 260px; overflow: auto;
`;
export const SuggestItem = styled.button`
  width: 100%; text-align: left; padding: 12px 16px; display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; border: 0; background: #fff;
`;
export const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #f0d2b6;
`;
export const HashIcon = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #f5f5f7; display: grid; place-items: center; font-weight: 900; font-size: 28px;
`;
export const AgreeRow = styled.label`
  display: flex; align-items: center; gap: 8px; padding: 16px; border-top: 1px solid #eee; color: #333;
`;
export const Checkbox = styled.input`
  width: 18px; height: 18px;
`;
export const PostBar = styled.div`
  position: fixed; left: 0; right: 0; bottom: var(--safe-bottom); padding: 16px;
`;
// PrimaryButton 공통 사용으로 대체됨
export const FileInput = styled.input`
  display: none;
`;
export const PickBtn = styled.button`
  width: 195px; height: 346px; display: grid; place-items: center;
  border-radius: 12px; border: 1px dashed #ddd; background: #fafafa; color: #666; margin: 0 auto;
`;

