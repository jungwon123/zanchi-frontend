"use client";

import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { commentsOpenState } from "../../_state/atoms";
import { SheetBackdrop, SheetWrap, SheetHeader, SheetHandle, SheetTitle, SheetBody, CommentItem, CommentMeta, ReplyLink, MoreRepliesLink, RepliesBlock, SheetInputBar, InputWrapper, InputField, SendButton } from "./style";

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

export default function CommentsSheet({ clipAuthor = "사용자" }) {
  const [open, setOpen] = useRecoilState(commentsOpenState);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showPrevReplies, setShowPrevReplies] = useState({});

  const comments = useMemo(() => [
    { id: "c1", author: "춤추는 잔치러", text: "노래하는 잔치러님.. 너무 멋있어요!!", ts: Date.now()-3600*1000, replies: [
      { id: "r1", author: "연극이 좋아", text: "👍👍👍👍👍", ts: Date.now()-86400*1000 },
      { id: "r2", author: "음악하는 사나이", text: "혹시 같이 작업 할 생각 있으세요?", ts: Date.now()-86400*1000*2 },
      { id: "r3", author: "팬", text: "대박...", ts: Date.now()-86400*1000*3 },
    ]},
  ], []);

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
          {comments.map((c) => (
            <div key={c.id}>
              <CommentItem $highlight={replyTo === c.author}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: "#eee" }} />
                <div>
                  <CommentMeta>
                    <strong>{c.author}</strong> · {timeAgo(c.ts)}
                  </CommentMeta>
                  <div>{c.text}</div>
                  <ReplyLink onClick={() => { setReplyTo(c.author); setInput(`@${c.author} `); }}>
                    답글달기
                  </ReplyLink>
                  {c.replies && c.replies.length > 0 && (
                    <div style={{ marginLeft: 40 }}>
                    <MoreRepliesLink onClick={() => setShowPrevReplies((s) => ({ ...s, [c.id]: !s[c.id] }))}>
                      이전 답글 {c.replies.length}개 더보기
                    </MoreRepliesLink>
                    </div>
                  )}
                  {showPrevReplies[c.id] && (
                    <RepliesBlock>
                      {c.replies.map((r) => (
                        <CommentItem key={r.id} $highlight={replyTo === r.author} style={{ paddingLeft: 0 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 16, background: "#eee" }} />
                          <div>
                            <CommentMeta>
                              <strong>{r.author}</strong> · {timeAgo(r.ts)}
                            </CommentMeta>
                            <div>{r.text}</div>
                            <ReplyLink onClick={() => { setReplyTo(r.author); setInput(`@${r.author} `); }}>
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
            <SendButton $enabled={sendEnabled} disabled={!sendEnabled} $src="/icon/submit.png" />
          </InputWrapper>
        </SheetInputBar>
      </SheetWrap>
    </>
  );
}


