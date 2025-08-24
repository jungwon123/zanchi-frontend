"use client";

import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { postActionsOpenState, postActionsState, myIdState } from "@/app/_state/atoms";
import { SheetBackdrop, SheetHeader, SheetHandle, SheetTitle } from "./style";
import { ActionsSheetWrap, ActionsList, ActionRow, RowIcon, CategoryList, CategoryRow } from "./style";

export default function PostActionsSheet({ isMine = false, clipId = null }) {
  const [open, setOpen] = useRecoilState(postActionsOpenState);
  const ctx = useRecoilValue(postActionsState);
  const myId = useRecoilValue(myIdState);
  const resolvedMine = isMine || (ctx?.uploaderId != null && myId != null && String(ctx.uploaderId) === String(myId));
  const [mode, setMode] = useState('root'); // 'root' | 'report' | 'confirm-delete'
  const wrapStyle = (() => {
    if (!open) return {};
    const modeToVh = mode === 'report' ?  '50vh' : mode === 'confirm-delete' ? '28vh' : '36vh';
    return { ['--sheet-h']: modeToVh, minHeight: modeToVh };
  })();

  // 닫힐 때 UI 상태 초기화
  useEffect(() => {
    if (!open) setMode('root');
  }, [open]);

  return (
    <>
      <SheetBackdrop $open={open} onClick={() => setOpen(false)} />
      <ActionsSheetWrap $open={open} style={wrapStyle} role="dialog" aria-label="게시물 동작">
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>{mode === 'report' ? '신고 사유 선택' : mode === 'confirm-delete' ? '삭제 확인' : '게시물'}</SheetTitle>
        </SheetHeader>
        {mode === 'root' && (
          <ActionsList>
            {resolvedMine && (
              <>
                <ActionRow onClick={() => { /* 수정 */ }}>
                  <RowIcon $src="/icon/edit.png" />
                  <span>수정하기</span>
                </ActionRow>
                <ActionRow onClick={() => { setMode('confirm-delete'); }}>
                  <RowIcon $src="/icon/trash.png" />
                  <span>삭제하기</span>
                </ActionRow>
              </>
            )}
            <ActionRow $danger onClick={() => { setMode('report'); }}>
              <RowIcon $src="/icon/caution.png" />
              <span>신고하기</span>
            </ActionRow>
          </ActionsList>
        )}
        {mode === 'confirm-delete' && (
          <ActionsList>
            <div style={{ padding: '8px 4px', color: '#666', textAlign: 'center' }}>삭제 하시겠습니까?</div>
            <ActionRow onClick={() => { /* 취소 */ setMode('root'); }}>
              <span>취소</span>
            </ActionRow>
            <ActionRow $danger onClick={() => { /* 실제 삭제는 추후 */ setOpen(false); setMode('root'); }}>
              <span>삭제</span>
            </ActionRow>
          </ActionsList>
        )}
        {mode === 'report' && (
          <>
            <CategoryList>
              <CategoryRow onClick={() => { /* 선택 */ }}>허위 정보/ 사기</CategoryRow>
              <CategoryRow onClick={() => { /* 선택 */ }}>부적절한 콘텐츠</CategoryRow>
              <CategoryRow onClick={() => { /* 선택 */ }}>폭력, 학대, 범죄</CategoryRow>
              <CategoryRow onClick={() => { /* 선택 */ }}>성적인 콘텐츠</CategoryRow>
            </CategoryList>
            <ActionsList>
              <ActionRow $danger onClick={() => { /* 신고 제출 */ setOpen(false); setMode('root'); }}>
                <RowIcon $src="/icon/caution.png" />
                <span>신고하기</span>
              </ActionRow>
            </ActionsList>
          </>
        )}
      </ActionsSheetWrap>
    </>
  );
}


