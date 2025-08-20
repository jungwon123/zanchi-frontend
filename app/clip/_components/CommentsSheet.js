"use client";

import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { commentsOpenState } from "../../_state/atoms";
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
  const [replyTo, setReplyTo] = useState(null);
  const [showPrevReplies, setShowPrevReplies] = useState({});
  const [list, setList] = useState([]);

  // 최초 열릴 때 댓글 로드
  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await getComments(clipId, { page: 0, size: 20 });
      setList(res.items);
    })();
  }, [open, clipId]);

  const placeholder = input.length === 0 ? `${clipAuthor}에게 댓글 추가` : "";
  const sendEnabled = input.trim().length > 0;

  // 동적으로 시트 높이를 CSS 변수로 노출하여 비디오가 동일한 윗선까지 줄어들게 함
  const sheetStyle = open ? { ['--sheet-h']: '70vh', minHeight: '500px' } : {};

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
              <CommentItem $highlight={replyTo === c.author}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eee" }} />
                <div>
                  <CommentMeta>
                    <strong>{c.author?.nickname ?? c.author}</strong> · {timeAgo(new Date(c.createdAt).getTime())}
                  </CommentMeta>
                  <div>{c.content}</div>
                  <ReplyLink onClick={() => { setReplyTo(c.author); setInput(`@${c.author} `); }}>
                    답글달기
                  </ReplyLink>
                  {!!c.replyCount && (
                    <div style={{ marginLeft: 40 }}>
                      <MoreRepliesLink onClick={async () => {
                        setShowPrevReplies((s) => ({ ...s, [c.id]: !s[c.id] }));
                        if (!showPrevReplies[c.id]) {
                          const r = await getReplies(clipId, c.id, { page: 0, size: 20 });
                          c._replies = r.items; // 메모리 캐시
                          setList((prev) => [...prev]);
                        }
                      }}>
                        이전 답글 {c.replyCount}개 더보기
                      </MoreRepliesLink>
                    </div>
                  )}
                  {showPrevReplies[c.id] && (
                    <RepliesBlock>
                      {(c._replies || []).map((r) => (
                        <CommentItem key={r.id} $highlight={replyTo === r.author} style={{ paddingLeft: 0 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 16, background: "#eee" }} />
                          <div>
                            <CommentMeta>
                              <strong>{r.author?.nickname ?? r.authorName ?? r.author}</strong> · {timeAgo(new Date(r.createdAt).getTime())}
                            </CommentMeta>
                            <div>{r.content}</div>
                            <ReplyLink onClick={() => { setReplyTo(r.author?.nickname ?? r.authorName ?? r.author); setInput(`@${r.author?.nickname ?? r.authorName ?? r.author} `); }}>
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
              const v = e.target.value;
              if (replyTo && !v.startsWith(`@${replyTo}`)) {
                setReplyTo(null);
              }
              setInput(v);
            }}
            />
            <SendButton
              $enabled={sendEnabled}
              disabled={!sendEnabled}
              $src="/icon/submit.png"
              onClick={async () => {
                if (!sendEnabled) return;
                const res = replyTo
                  ? await addReply(clipId, list.find((c) => `@${c.author?.nickname ?? c.author}` === replyTo)?.id || list[0]?.id, { content: input.trim() })
                  : await addComment(clipId, { content: input.trim() });
                // 단순 리프레시
                const next = await getComments(clipId, { page: 0, size: 20 });
                setList(next.items);
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


