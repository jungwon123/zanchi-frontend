"use client";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { shareOpenState } from "../../_state/atoms";
import { SheetBackdrop, SheetHeader, SheetHandle, SheetTitle, ShareWrap, ShareBody, ShareItem, ShareIcon } from "./style";

export default function ShareSheet() {
  const [open, setOpen] = useRecoilState(shareOpenState);
  const [copied, setCopied] = useState(false);
  const wrapStyle = open ? { ['--sheet-h']: '40vh' } : {};

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // 필요 시 일정 시간 후 자동 닫기
      // setTimeout(() => setOpen(false), 800);
    } catch { /* ignore */ }
  };

  return (
    <>
      <SheetBackdrop $open={open} onClick={() => setOpen(false)} />
      <ShareWrap $open={open} style={wrapStyle}>
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>공유하기</SheetTitle>
        </SheetHeader>
        <ShareBody>
          <ShareItem onClick={onCopy}>
            <ShareIcon $src={copied ? "/icon/sharecomplete.png" : "/icon/linkshare.png"} />
            <span>링크 복사</span>
          </ShareItem>
          <ShareItem onClick={() => {/* TODO: Kakao SDK */}}>
            <ShareIcon $src="/icon/kakaoshare.png" />
            <span>카카오톡</span>
          </ShareItem>
          <ShareItem onClick={() => { window.location.href = `sms:&body=${encodeURIComponent(window.location.href)}`; }}>
            <ShareIcon $src="/icon/messageshare.png" />
            <span>메시지</span>
          </ShareItem>
        </ShareBody>
      </ShareWrap>
    </>
  );
}


