"use client";

import styled from "styled-components";

export const Wrap = styled.div`
  min-height: 100svh;
  background: #fff;
  color: #111;
  padding: 16px 16px calc(120px + var(--safe-bottom));
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
`;
export const BackBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  background-image: url("/icon/back.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;
export const Title = styled.div`
  font-weight: 900;
  font-size: 20px;
`;

export const SectionTitle = styled.div`
  font-weight: 900;
  font-size: 20px;
  margin: 18px 0 12px;
`;

export const ShowCard = styled.div`
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 12px;
  align-items: center;
  border-radius: 16px;
`;
export const Poster = styled.div`
  width: 85px;
  height: 113px;
  border-radius: 16px;
  background: #ddd url("/images/ticket/poster.png") center/cover no-repeat;
`;
export const ShowInfo = styled.div`
  display: grid;
  gap: 0px;
`;
export const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
`;
export const Icon = styled.span`
  width: 20px;
  height: 20px;
  display: inline-block;
  background-image: url(${(p) => p.$src || "none"});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const PayMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-top: 0px;
`;
export const PayBtn = styled.button`
  height: 48px;
  border-radius: 12px;
  border: 0.5px solid #ccc;
  background: ${(p) => (p.$active ? "#FF7D0A" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;
export const PayIcon = styled.span`
  width: 100%;
  height: 100%;
  display: block;
  background-image: url(${(p) => p.$src || "none"});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const PointBox = styled.div`
  border-radius: 12px;
  padding: 0px 0px;
  display: grid;
  gap: 10px;
`;
export const PointRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
`;
export const PointInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #ccc;
  padding: 0 14px;
  outline: none;
  font-size: 16px;
  color: ${(p) => (p.$typed ? "#111" : "#999")};
`;
export const PointMeta = styled.div`
  font-size: 12px;
  color: #777;
`;
export const UseAllBtn = styled.button`
  height: 32px;
  border-radius: 12px;
  padding: 0 16px;
  border: 0;
  background: #ff7d0a;
  color: #fff;
  font-weight: 800;
`;

export const Summary = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  gap: 10px;
  padding: 12px 0;
  margin: 16px 0;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw; /* 패딩과 무관하게 전체 루트 폭 */
    background: #f6f6f6;
    pointer-events: none;
  }
  &::before {
    top: 0;
    height: 3px;
  }
  &::after {
    bottom: 0;
    height: 1px;
  }
`;
export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
`;
export const FinalRow = styled(SummaryRow)`
  font-weight: 900;
  font-size: 22px;
  color: #111;
`;

export const BottomBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: #fff;
  padding-bottom: calc(16px + var(--safe-bottom));
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.04);
`;
