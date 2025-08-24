"use client";

import styled from "styled-components";

export const Container = styled.div`
  min-height: 100svh; background: #fff; color: #111;
`;

export const TopBar = styled.div`
  display: grid; grid-template-columns: 1fr auto; align-items: center;
  padding: 12px 16px;
`;
export const Title = styled.div`
  font-weight: 800; font-size: 18px;
`;
export const SettingsBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url('/icon/assignment.png'); background-repeat: no-repeat; background-position: center; background-size: contain;
`;

export const Avatar = styled.div`
  width: 120px; height: 120px; border-radius: 60px; background: #e5e5e5; margin: 12px auto 8px;
`;
export const Handle = styled.div`
  text-align: center; font-size: 18px; color: #333; margin-bottom: 16px;
`;

export const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 8px; margin-bottom: 12px;
  & strong { display: block; font-size: 22px; margin-bottom: 6px; }
  & span { color: #666; font-size: 14px; }
`;

export const ActionsRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; margin: 8px 0 16px;
`;
export const ActionBtn = styled.button`
  height: 44px; border-radius: 12px; border: 0; font-weight: 700; background: ${(p)=> p.$primary ? '#ff7d0a' : '#eee'}; color: ${(p)=> p.$primary ? '#fff' : '#333'};
`;

export const Tabs = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #f0f0f0; margin-top: 8px;
`;
export const TabBtn = styled.button`
  height: 44px; border: 0; background: #fff; font-weight: 800; color: ${(p)=> p.$active ? '#111' : '#777'}; position: relative;
  &::after{
    content: ""; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0;
    width: ${(p)=> p.$active ? '70%' : '0'}; height: 2px; background: #ff7d0a; transition: width 160ms ease;
  }
`;

export const Grid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #f0f0f0;
`;
export const Card = styled.button`
  position: relative; border: 0; background: #dcdcdc; aspect-ratio: 9/16;
`;
export const ViewsBadge = styled.span`
  position: absolute; right: 4px; bottom: 4px; color: #000; font-weight: 700; font-size: 13px;
`;


