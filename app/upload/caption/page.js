"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { uploadCaptionState } from "../../_state/atoms";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100svh; background: #fff; color: #111;
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: 1fr auto; align-items: center; padding: 12px 16px;
`;
const Confirm = styled.button`
  background: none; border: 0; color: #ff8a00; font-weight: 700; font-size: 16px;
`;
const CaptionArea = styled.textarea`
  width: 100%; min-height: 160px; border: none; outline: none; resize: none; font-size: 18px; padding: 16px;
`;
const Suggestions = styled.div`
  border-top: 1px solid #eee; max-height: 260px; overflow: auto;
`;
const Item = styled.button`
  width: 100%; text-align: left; padding: 12px 16px; display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; border: 0; background: #fff;
`;
const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #f0d2b6;
`;
const HashIcon = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #f5f5f7; display: grid; place-items: center; font-weight: 900; font-size: 28px;
`;

export default function CaptionEditPage() {
  const router = useRouter();
  const [caption, setCaption] = useRecoilState(uploadCaptionState);
  const [mode, setMode] = useState(null); // '@' | '#'
  const [keyword, setKeyword] = useState("");

  const following = ["like_singing","gonono_room","just_song","listen_to_music","norea_hagoshipni","music_maker"]; // demo
  const hashtags = ["노래","노래부르기","노래연습","노래연습실","노래학원"]; // demo

  const onChange = (e) => {
    const v = e.target.value;
    setCaption(v);
    const caret = v.slice(Math.max(0,v.lastIndexOf('\n')+1));
    const m = caret.match(/([@#][^\s]*)$/);
    if (m) { setMode(m[1][0]); setKeyword(m[1]); } else { setMode(null); setKeyword(''); }
  };

  const data = useMemo(()=>{
    if (mode === '@') return following.filter(h=> h.startsWith(keyword.replace('@',''))).map(v=>({type:'user', value:v}));
    if (mode === '#') return hashtags.filter(h=> h.startsWith(keyword.replace('#',''))).map(v=>({type:'hash', value:v}));
    return [];
  },[mode, keyword]);

  const apply = (it) => {
    const replaced = caption.replace(/([@#][^\s]*)$/, mode + it.value + ' ');
    setCaption(replaced); setMode(null); setKeyword('');
  };

  return (
    <Container>
      <TopBar>
        <div>캡션</div>
        <Confirm onClick={()=> router.back()}>확인</Confirm>
      </TopBar>
      <CaptionArea autoFocus placeholder="캡션 추가…" value={caption} onChange={onChange} />
      {data.length>0 && (
        <Suggestions>
          {data.map((it, i)=> (
            <Item key={i} onClick={()=> apply(it)}>
              {it.type==='user' ? <Avatar /> : <HashIcon>#</HashIcon>}
              <div>{it.type==='user'?'@':'#'}{it.value}</div>
            </Item>
          ))}
        </Suggestions>
      )}
    </Container>
  );
}


