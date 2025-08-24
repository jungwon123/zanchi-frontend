"use client";

import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { commentsOpenState, myIdState } from "../../_state/atoms";
import { useRouter } from "next/navigation";
import { SheetBackdrop, SheetWrap, SheetHeader, SheetHandle, SheetTitle, SheetBody, CommentItem, CommentMeta, ReplyLink, MoreRepliesLink, RepliesBlock, SheetInputBar, InputWrapper, InputField, SendButton } from "./style";
import { getComments, addComment, getReplies, addReply } from "@/app/_api/comments";

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  const units = [
    [60, "초"],
    [60, "분"],
    [24, "시간"],
    [7, "일"],
    [4, "주"],
    [12, "달"],
  ];
  let v = diff; let i = 0; let label = "초";
  for (; i < units.length && v >= units[i][0]; i++) {
    v = Math.floor(v / units[i][0]);
    label = units[i][1];
  }
  if (label === "달" && v >= 12) return `${Math.floor(v/12)}년`;
  return `${v}${label}`;
}

export default function CommentsSheet({ clipAuthor = "사용자", clipId = 10 }) {
  const [open, setOpen] = useRecoilState(commentsOpenState);
  const [input, setInput] = useState("");
  // replyTo: { parentId: number, name: string } | null
  const [replyTo, setReplyTo] = useState(null);
  const [showPrevReplies, setShowPrevReplies] = useState({});
  const [list, setList] = useState([]);
  const myId = useRecoilValue(myIdState);
  const router = useRouter();

  const nameOf = (authorObj, fallbackName) => {
    if (authorObj && typeof authorObj === 'object') {
      return authorObj.nickname ?? authorObj.name ?? authorObj.authorName ?? fallbackName;
    }
    return fallbackName;
  };

  // 최초 열릴 때 댓글 로드
  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await getComments(clipId, { page: 0, size: 20 });
      setList(res.items);
    })();
  }, [open, clipId]);

  // 클립이 바뀌면 답글 타겟/입력/펼침 상태 초기화
  useEffect(() => {
    setReplyTo(null);
    setInput("");
    setShowPrevReplies({});
  }, [clipId]);

  const placeholder = input.length === 0 ? `${clipAuthor}에게 댓글 추가` : "";
  const sendEnabled = input.trim().length > 0;

  // 동적으로 시트 높이를 CSS 변수로 노출하여 비디오가 동일한 윗선까지 줄어들게 함
  const sheetStyle = open ? { ['--sheet-h']: '70vh', minHeight: '500px' } : {};

  const goProfile = (userId) => {
    if (!userId) return;
    if (myId != null && String(myId) === String(userId)) router.push('/profile/me');
    else router.push(`/profile?userId=${userId}`);
  };

  return (
    <>
      <SheetBackdrop $open={open} onClick={() => setOpen(false)} />
      <SheetWrap $open={open} role="dialog" aria-label="댓글" style={sheetStyle}>
        <SheetHeader>
          <SheetHandle />
          <SheetTitle>댓글</SheetTitle>
        </SheetHeader>
        <SheetBody>
          {list.map((c) => (
            <div key={c.id}>
              <CommentItem $highlight={replyTo?.name === nameOf(c.author, c.authorName ?? c.author)}>
                <div onClick={() => goProfile(c?.author?.id ?? c.authorId)} style={{ width: 36, height: 36, borderRadius: 18, background: "#eee", cursor: (c?.author?.id ?? c.authorId) ? 'pointer' : 'default' }} />
                <div>
                  <CommentMeta>
                    <strong onClick={() => goProfile(c?.author?.id ?? c.authorId)} style={{ cursor: (c?.author?.id ?? c.authorId) ? 'pointer' : 'default' }}>{nameOf(c.author, c.authorName ?? c.author)}</strong> · {timeAgo(new Date(c.createdAt).getTime())}
                  </CommentMeta>
                  <div>{c.content}</div>
                  <ReplyLink onClick={async () => { 
                    const name = nameOf(c.author, c.authorName ?? c.author);
                    setReplyTo({ parentId: c.id, name });
                    setInput(`@${name} `);
                    // 대댓글 영역 자동 펼치고 필요 시 로드
                    setShowPrevReplies((s) => ({ ...s, [c.id]: true }));
                    if (!Array.isArray(c._replies) || c._replies.length === 0) {
                      const parentId0 = c.id ?? c.commentId;
                      if (parentId0 == null) return;
                      const r = await getReplies(clipId, parentId0, { page: 0, size: 20 });
                      setList((prev) => {
                        const idx = prev.findIndex((x) => x.id === c.id);
                        if (idx < 0) return prev;
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], _replies: r.items, replyCount: r.items?.length ?? copy[idx].replyCount };
                        return copy;
                      });
                    }
                  }}>
                    답글달기
                  </ReplyLink>
                  {!!c.replyCount && (
                    <div style={{ marginLeft: 40 }}>
                      <MoreRepliesLink onClick={async () => {
                        const wasOpen = !!showPrevReplies[c.id];
                        const nextOpen = !wasOpen;
                        setShowPrevReplies((s) => ({ ...s, [c.id]: nextOpen }));
                        if (nextOpen && (!Array.isArray(c._replies) || c._replies.length === 0)) {
                          const parentId1 = c.id ?? c.commentId;
                          if (parentId1 == null) return;
                          const r = await getReplies(clipId, parentId1, { page: 0, size: 20 });
                          setList((prev) => {
                            const idx = prev.findIndex((x) => x.id === c.id);
                            if (idx < 0) return prev;
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], _replies: r.items, replyCount: r.items?.length ?? copy[idx].replyCount };
                            return copy;
                          });
                        }
                      }}>
                        이전 답글 {c.replyCount}개 더보기
                      </MoreRepliesLink>
                    </div>
                  )}
                  {showPrevReplies[c.id] && (
                    <RepliesBlock>
                      {(c._replies || []).map((r) => (
                        <CommentItem key={r.id} $highlight={replyTo?.name === nameOf(r.author, r.authorName ?? r.author)} style={{ paddingLeft: 0 }}>
                          <div onClick={() => goProfile(r?.author?.id ?? r.authorId)} style={{ width: 32, height: 32, borderRadius: 16, background: "#eee", cursor: (r?.author?.id ?? r.authorId) ? 'pointer' : 'default' }} />
                          <div>
                            <CommentMeta>
                              <strong onClick={() => goProfile(r?.author?.id ?? r.authorId)} style={{ cursor: (r?.author?.id ?? r.authorId) ? 'pointer' : 'default' }}>{nameOf(r.author, r.authorName ?? r.author)}</strong> · {timeAgo(new Date(r.createdAt).getTime())}
                            </CommentMeta>
                            <div>{r.content}</div>
                            <ReplyLink onClick={async () => { 
                              const name = nameOf(r.author, r.authorName ?? r.author);
                              setReplyTo({ parentId: c.id, name });
                              setInput(`@${name} `);
                              setShowPrevReplies((s) => ({ ...s, [c.id]: true }));
                              if (!Array.isArray(c._replies) || c._replies.length === 0) {
                                const parentId2 = c.id ?? c.commentId;
                                if (parentId2 == null) return;
                                const r2 = await getReplies(clipId, parentId2, { page: 0, size: 20 });
                                setList((prev) => {
                                  const idx = prev.findIndex((x) => x.id === c.id);
                                  if (idx < 0) return prev;
                                  const copy = [...prev];
                                  copy[idx] = { ...copy[idx], _replies: r2.items, replyCount: r2.items?.length ?? copy[idx].replyCount };
                                  return copy;
                                });
                              }
                            }}>
                              답글달기
                            </ReplyLink>
                          </div>
                        </CommentItem>
                      ))}
                    </RepliesBlock>
                  )}
                </div>
              </CommentItem>
            </div>
          ))}
        </SheetBody>
        <SheetInputBar>
          {/* 프로필 사진 */}
          <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eee" }} />
          <InputWrapper>
            <InputField
              placeholder={placeholder}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <SendButton
              $enabled={sendEnabled}
              disabled={!sendEnabled}
              $src="/icon/submit.png"
              onClick={async () => {
                if (!sendEnabled) return;
                const parentId = replyTo?.parentId;
                const validParent = parentId != null && list.some((c) => c.id === parentId);
                if (validParent) {
                  await addReply(clipId, parentId, { content: input.trim() });
                  // 답글 섹션 자동 열기 및 최신화
                  setShowPrevReplies((s) => ({ ...s, [parentId]: true }));
                  const r = await getReplies(clipId, parentId, { page: 0, size: 20 });
                  const parentIdx = list.findIndex((c) => c.id === parentId);
                  if (parentIdx >= 0) {
                    const nextList = [...list];
                    const parent = nextList[parentIdx] || {};
                    const prevReplies = Array.isArray(parent._replies) ? parent._replies : [];
                    nextList[parentIdx] = { ...parent, _replies: r.items.length ? r.items : prevReplies };
                    setList(nextList);
                  }
                } else {
                  await addComment(clipId, { content: input.trim() });
                  // 최상위 댓글은 목록 새로고침
                  const next = await getComments(clipId, { page: 0, size: 20 });
                  setList(next.items);
                }
                setInput("");
                setReplyTo(null);
              }}
            />
          </InputWrapper>
        </SheetInputBar>
      </SheetWrap>
    </>
  );
}


