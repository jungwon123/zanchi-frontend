"use client";

import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { postActionsOpenState, postActionsState, myIdState } from "@/app/_state/atoms";
import { useRouter } from "next/navigation";
import { SheetBackdrop, SheetHeader, SheetHandle, SheetTitle } from "./style";
import { ActionsSheetWrap, ActionsList, ActionRow, RowIcon, CategoryList, CategoryRow } from "./style";
import { deleteClip } from "@/app/_api/clips";

export default function PostActionsSheet({ isMine = false, clipId = null }) {
  const [open, setOpen] = useRecoilState(postActionsOpenState);
  const ctx = useRecoilValue(postActionsState);
  const myId = useRecoilValue(myIdState);
  const resolvedMine = isMine || (ctx?.uploaderId != null && myId != null && String(ctx.uploaderId) === String(myId));
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  // 독립 시트로 분리
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const rootStyle = open ? { ['--sheet-h']: '36vh', minHeight: '36vh' } : {};
  const deleteStyle = deleteOpen ? { ['--sheet-h']: '28vh', minHeight: '28vh' } : {};
  const reportStyle = reportOpen ? { ['--sheet-h']: '50vh', minHeight: '50vh' } : {};

  // 닫힐 때 UI 상태 초기화
  useEffect(() => {
    if (!open) {
      setDeleteOpen(false);
      setReportOpen(false);
    }
  }, [open]);

  return (
    <>
      {/* ROOT SHEET */}
      <SheetBackdrop $open={open} onClick={() => setOpen(false)} />
      <ActionsSheetWrap $open={open} style={rootStyle} role="dialog" aria-label="게시물">
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>게시물</SheetTitle>
        </SheetHeader>
        <ActionsList>
          {resolvedMine && (
            <>
              <ActionRow onClick={() => { setOpen(false); setTimeout(()=> { router.push(`/upload/caption?clipId=${ctx?.clipId || clipId}&caption=${encodeURIComponent(ctx?.caption || '')}`); }, 200); }}>
                <RowIcon $src="/icon/edit.png" />
                <span>수정하기</span>
              </ActionRow>
              <ActionRow onClick={() => { setOpen(false); setTimeout(()=> setDeleteOpen(true), 220); }}>
                <RowIcon $src="/icon/trash.png" />
                <span>삭제하기</span>
              </ActionRow>
            </>
          )}
          <ActionRow $danger onClick={() => { setOpen(false); setTimeout(()=> setReportOpen(true), 220); }}>
            <RowIcon $src="/icon/caution.png" />
            <span>신고하기</span>
          </ActionRow>
        </ActionsList>
      </ActionsSheetWrap>

      {/* DELETE CONFIRM SHEET */}
      <SheetBackdrop $open={deleteOpen} onClick={() => setDeleteOpen(false)} />
      <ActionsSheetWrap $open={deleteOpen} style={deleteStyle} role="dialog" aria-label="삭제 확인">
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>삭제 확인</SheetTitle>
        </SheetHeader>
        <ActionsList>
          <div style={{ padding: '8px 4px', color: '#666', textAlign: 'center' }}>삭제 하시겠습니까?</div>
          <ActionRow onClick={() => { if (isDeleting) return; setDeleteOpen(false); setTimeout(()=> setOpen(true), 200); }}>
            <span>취소</span>
          </ActionRow>
          <ActionRow $danger onClick={async () => { if (isDeleting) return; try { setIsDeleting(true); const id = ctx?.clipId || clipId; if (id != null) { await deleteClip(id); } } catch {} finally { setIsDeleting(false); } setDeleteOpen(false); setOpen(false); router.push('/clip'); }}>
            <span>{isDeleting ? '삭제 중…' : '삭제'}</span>
          </ActionRow>
        </ActionsList>
      </ActionsSheetWrap>

      {/* REPORT SHEET */}
      <SheetBackdrop $open={reportOpen} onClick={() => setReportOpen(false)} />
      <ActionsSheetWrap $open={reportOpen} style={reportStyle} role="dialog" aria-label="신고">
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>신고 사유 선택</SheetTitle>
        </SheetHeader>
        <CategoryList>
          <CategoryRow onClick={() => { /* 선택 */ }}>허위 정보/ 사기</CategoryRow>
          <CategoryRow onClick={() => { /* 선택 */ }}>부적절한 콘텐츠</CategoryRow>
          <CategoryRow onClick={() => { /* 선택 */ }}>폭력, 학대, 범죄</CategoryRow>
          <CategoryRow onClick={() => { /* 선택 */ }}>성적인 콘텐츠</CategoryRow>
        </CategoryList>
        <ActionsList>
          <ActionRow $danger onClick={() => { /* 신고 제출 */ setReportOpen(false); }}>
            <RowIcon $src="/icon/caution.png" />
            <span>신고하기</span>
          </ActionRow>
        </ActionsList>
      </ActionsSheetWrap>
    </>
  );
}


