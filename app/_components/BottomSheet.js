"use client";

import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity 200ms ease;
  z-index: 100;
`;

const Sheet = styled.div`
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #fff;
  color: #111;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  transform: translateY(${(p)=> (p.$open ? '0%' : '100%')});
  transition: transform 240ms ease;
  max-height: 80vh;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  z-index: 101;
`;

const Handle = styled.div`
  width: 68px; height: 5px; background: #ccc; border-radius: 3px; margin: 10px auto;
`;

const Header = styled.div`
  padding: 4px 16px 10px;
  text-align: center; font-weight: 800; font-size: 18px;
`;

const Body = styled.div`
  overflow: auto;
`;

export default function BottomSheet({ open, title, onClose, children }) {
  const startYRef = React.useRef(0);
  const deltaRef = React.useRef(0);

  const onTouchStart = (e) => {
    startYRef.current = e.touches?.[0]?.clientY || 0;
  };
  const onTouchMove = (e) => {
    const cur = e.touches?.[0]?.clientY || 0;
    deltaRef.current = cur - startYRef.current;
  };
  const onTouchEnd = () => {
    if (deltaRef.current > 40) onClose?.();
    startYRef.current = 0; deltaRef.current = 0;
  };

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />
      <Sheet
        $open={open}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="dialog"
        aria-modal="true"
      >
        <div>
          <Handle />
          {title ? <Header>{title}</Header> : null}
        </div>
        <Body>{children}</Body>
      </Sheet>
    </>
  );
}


