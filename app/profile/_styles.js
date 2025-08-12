"use client";

import styled from "styled-components";

export const Container = styled.div`
  min-height: 100svh;
  background: #fff;
  color: #111;
`;

export const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center;
  padding: 12px 16px;
`;
export const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url('/icon/back.png'); background-size: 24px 24px; background-position: center; background-repeat: no-repeat;
`;
export const HandleText = styled.div`
  font-weight: 600;
`;

export const Avatar = styled.div`
  width: 80px; height: 80px; border-radius: 80px; background: #f0d2b6; margin: 16px auto 12px;
`;
export const Nickname = styled.h1`
  text-align: center; font-size: 28px; font-weight: 700; margin: 8px 0 12px;
`;
export const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 8px; margin-bottom: 12px;
  & strong { display: block; font-size: 22px; margin-bottom: 6px; }
  & span { color: #666; font-size: 14px; }
`;
export const ActionsRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; margin: 8px 0 16px;
`;
export const PrimaryBtn = styled.button`
  height: 48px; border-radius: 12px; border: 0; font-weight: 700; background: ${(p)=>p.$active? '#ff8a00':'#ff8a00'}; color: #fff; opacity: ${(p)=>p.$pressed? .5:1};
`;
export const SecondaryBtn = styled.button`
  height: 48px; border-radius: 12px; border: 0; font-weight: 700; background: #eee; color: #333; opacity: ${(p)=>p.$pressed? .5:1};
`;

export const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr 1fr; 
`;
export const ClipCard = styled.button`
  position: relative; aspect-ratio: 9/16; border: 0; background: #b0b0b7;  overflow: hidden;
  &:active { filter: brightness(0.5); }
`;
export const ViewsBadge = styled.span`
  position: absolute; right: 4px; bottom: 4px; color: #fff; font-size: 12px; display: inline-flex; align-items: center; gap: 2px;
`;

