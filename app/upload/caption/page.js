"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { updateClipCaption } from "@/app/_api/clips";
import { getMySummary, getFollowing } from "@/app/_api/profile";
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
  border-top: 1px solid #eee; max-height: 260px; overflow: auto; padding-bottom: var(--safe-bottom);
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
  const params = useSearchParams();
  const [caption, setCaption] = useRecoilState(uploadCaptionState);
  const [mode, setMode] = useState(null); // '@' | '#'
  const [keyword, setKeyword] = useState("");

  const toAbsoluteUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
    const baseTrimmed = base.replace(/\/+$/, "");
    const pathTrimmed = String(url).replace(/^\/+/, "");
    return `${baseTrimmed}/${pathTrimmed}`;
  };

  const hashtags = ["노래","노래부르기","노래연습","노래연습실","노래학원"]; // demo

  const { data: me } = useQuery({ queryKey: ['me-summary-for-caption'], queryFn: getMySummary, staleTime: 60_000 });
  const q = (keyword || '').startsWith('@') ? (keyword || '').slice(1) : '';
  const { data: followingData } = useQuery({
    queryKey: ['caption-following', me?.id, q],
    enabled: !!me?.id && mode === '@',
    queryFn: async () => {
      try {
        const res = await getFollowing(me.id, { page: 0, size: 50, q });
        const list = Array.isArray(res?.content) ? res.content : [];
        return list.map((m) => ({ loginId: m?.loginId, avatarUrl: m?.avatarUrl })).filter((m) => !!m.loginId);
      } catch { return []; }
    },
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const onChange = (e) => {
    const v = e.target.value;
    setCaption(v);
    const caret = v.slice(Math.max(0,v.lastIndexOf('\n')+1));
    const m = caret.match(/([@#][^\s]*)$/);
    if (m) { setMode(m[1][0]); setKeyword(m[1]); } else { setMode(null); setKeyword(''); }
  };

  const data = useMemo(()=>{
    if (mode === '@') {
      const raws = Array.isArray(followingData) ? followingData : [];
      const key = keyword.replace('@','');
      return raws
        .filter((m) => String(m.loginId).toLowerCase().includes(String(key).toLowerCase()))
        .map((m) => ({ type: 'user', value: m.loginId, avatarUrl: m.avatarUrl }));
    }
    if (mode === '#') return hashtags.filter(h=> h.startsWith(keyword.replace('#',''))).map(v=>({type:'hash', value:v}));
    return [];
  },[mode, keyword, followingData]);

  const apply = (it) => {
    const replaced = caption.replace(/([@#][^\s]*)$/, mode + it.value + ' ');
    setCaption(replaced); setMode(null); setKeyword('');
  };

  useEffect(() => {
    // 편집 진입 시 쿼리로 전달된 초기 캡션을 세팅
    const cap = params.get('caption');
    if (cap != null) {
      try { setCaption(decodeURIComponent(cap)); }
      catch { setCaption(cap); }
    }
  }, [params, setCaption]);

  return (
    <Container>
      <TopBar>
        <div>캡션</div>
        <Confirm onClick={async ()=>{
          const clipIdStr = params.get('clipId');
          const clipId = clipIdStr ? Number(clipIdStr) : null;
          if (clipId) {
            try { await updateClipCaption(clipId, { caption }); } catch {}
          }
          router.back();
        }}>확인</Confirm>
      </TopBar>
      <CaptionArea autoFocus placeholder="캡션 추가…" value={caption} onChange={onChange} />
      {data.length>0 && (
        <Suggestions>
          {data.map((it, i)=> (
            <Item key={i} onClick={()=> apply(it)}>
              {it.type==='user' ? (
                <Avatar style={{ backgroundImage: `url(${it.avatarUrl ? toAbsoluteUrl(it.avatarUrl) : '/icon/default.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <HashIcon>#</HashIcon>
              )}
              <div>{it.type==='user'?'@':'#'}{it.value}</div>
            </Item>
          ))}
        </Suggestions>
      )}
    </Container>
  );
}


