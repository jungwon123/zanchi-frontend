"use client";

import styled from "styled-components";

export const Container = styled.div`
  min-height: 100svh;
  color: #111;
  background: #fff;
`;

export const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 16px;
`;

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  border-radius: 24px;
  border: 1px solid #e0e0e6;
  gap: 3px;
  padding: 10px 14px;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #111;
  &::placeholder { color: #b0b0b7; }
`;

export const SearchIcon = styled.img`
  width: 16px; height: 16px;
`;

export const CancelBtn = styled.button`
  border: none; background: transparent; color: #666; font-size: 16px;
`;

export const Section = styled.div`
  padding: 0 16px; margin-top: 20px;
`;

export const SectionTitle = styled.div`
  font-weight: 400; margin-bottom: 12px;
`;

export const Chips = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px;
`;

export const Chip = styled.span`
  display: inline-flex; align-items: center; gap: 8px;
   color: #333; border-radius: 999px; padding: 4px 12px;
   border: 1px solid #e0e0e6;
  font-size: 14px;
`;

export const ChipRemove = styled.button`
  width: 16px; height: 16px; color: #bbbbbb; line-height: 16px; display: grid; place-items: center; font-size: 25px;
`;

export const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding-bottom: 24px;
`;

export const Card = styled.button`
  border: none; background: transparent; text-align: left;
`;

export const Thumb = styled.div`
  width: 100%; aspect-ratio: 9/16; background: #b0b0b7; border-radius: 6px; position: relative;
`;

export const PlayBadge = styled.span`
  position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,.6); color: #fff; font-size: 12px; padding: 2px 6px; border-radius: 12px;
`;

export const MetaRow = styled.div`
  display: grid; grid-template-columns: 36px 1fr; gap: 10px; align-items: center; margin-top: 10px;
`;

export const Avatar = styled.div`
  width: 36px; height: 36px; border-radius: 18px; background: #f0d2b6;
`;

export const MetaText = styled.div`
  display: flex; flex-direction: column; gap: 2px;
  & > strong { font-weight: 600; color: #111; }
  & > span { color: #666; font-size: 13px; }
`;

/* Tabs and results area (shown when there is a query) */
export const TabsBar = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: 24px;
  padding: 0 16px; margin-top: 16px; position: sticky; top: 0; background: #fff; z-index: 5;
`;
export const TabBtn = styled.button`
  background: none; border: 0; font-size: 20px; color: ${(p)=>p.$active? '#111':'#999'}; font-weight: ${(p)=>p.$active? 700:500}; padding: 10px 4px; position: relative;
  &:after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; border-radius: 2px; background: ${(p)=>p.$active? '#ff8a00':'transparent'}; }
`;
export const PagesWrap = styled.div`
  overflow: hidden; width: 100%;
`;
export const PagesInner = styled.div`
  display: flex; width: 200%; transition: transform 220ms ease; transform: translateX(${(p)=>p.$index === 0 ? '0%' : '-50%'});
`;
export const PagePane = styled.div`
  width: 50%; padding: 0 16px 24px;
`;
export const AccountsList = styled.div`
  display: grid; gap: 16px; padding-top: 12px;
`;
export const AccountItem = styled.button`
  background: none; border: 0; text-align: left; display: grid; grid-template-columns: 48px 1fr; gap: 12px; align-items: center;
`;
export const AccountAvatar = styled.div`
  width: 48px; height: 48px; border-radius: 24px; background: #f0d2b6;
`;
export const AccountText = styled.div`
  display: flex; flex-direction: column; gap: 2px;
  & > strong { font-weight: 600; color: #111; }
  & > span { color: #666; font-size: 13px; }
`;
export const SortBar = styled.div`
  display: flex; gap: 8px; margin: 8px 0 12px; align-items: center;
`;
export const SortChip = styled.button`
  border: 1px solid ${(p)=>p.$active? '#ff8a00':'#e0e0e6'}; color: ${(p)=>p.$active? '#ff8a00':'#555'}; background: #fff; border-radius: 999px; padding: 6px 10px; font-size: 12px;
`;

