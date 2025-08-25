"use client";

import styled from "styled-components";
import React from "react";

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
  background: ${(p) =>
    p.disabled ? "var(--sub, #FFDAB8)" : "var(--main, #FF7D0A)"};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
`;

export default function PrimaryButton({
  children,
  onClick,
  throttleMs = 600,
  lockWhileAsync = true,
  disabled,
  ...props
}) {
  const [busy, setBusy] = React.useState(false);

  const handleClick = async (e) => {
    if (busy || disabled) return;
    if (typeof onClick !== "function") return;

    // 비동기 처리 동안 잠금
    try {
      const ret = onClick(e);
      if (lockWhileAsync && ret && typeof ret.then === "function") {
        setBusy(true);
        try {
          await ret;
        } finally {
          setBusy(false);
        }
        return;
      }
      // 동기 처리: 짧은 쓰로틀
      setBusy(true);
      setTimeout(() => setBusy(false), Math.max(0, throttleMs));
    } catch (err) {
      // 에러 시 잠금 해제
      setBusy(false);
      throw err;
    }
  };

  return (
    <Base {...props} disabled={busy || disabled} onClick={handleClick}>
      {children}
    </Base>
  );
}
