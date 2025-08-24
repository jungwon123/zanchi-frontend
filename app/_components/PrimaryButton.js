"use client";

import styled from "styled-components";

const Base = styled.button`
  display: flex;
  padding: 16px 0;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: 0;
  border-radius: 100px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: ${(p) => (p.disabled ? "var(--sub, #FFDAB8)" : "var(--main, #FF7D0A)")};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
`;

export default function PrimaryButton({ children, ...props }) {
  return <Base {...props}>{children}</Base>;
}


