"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, TopBar, BackBtn, Title, VideoBox, VideoTag, EditBadge, CaptionWrap, CaptionLabel, CaptionPreview, Suggestions, SuggestItem, Avatar, HashIcon, AgreeRow, Checkbox, PostBar, FileInput, PickBtn } from "./_styles";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useRecoilState } from "recoil";
import { uploadVideoUrlState, uploadCaptionState } from "../_state/atoms";
import { useMutation } from "@tanstack/react-query";
import { uploadClip } from "@/app/_api/clips";

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [fileUrl, setFileUrl] = useRecoilState(uploadVideoUrlState);
  const [caption, setCaption] = useRecoilState(uploadCaptionState);
  const [agree, setAgree] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [mode, setMode] = useState(null); // '@' | '#'
  const [keyword, setKeyword] = useState("");
  const enabled = agree;

  const following = ["like_singing","gonono_room","just_song","listen_to_music","norea_hagoshipni","music_maker"]; // demo
  const hashtags = ["노래","노래부르기","노래연습","노래연습실","노래학원"]; // demo

  useEffect(()=>{
    if (mode) setShowSuggest(true); else setShowSuggest(false);
  },[mode, keyword]);

  const mentionData = useMemo(()=>{
    if (mode === '@') {
      return following.filter(h => h.startsWith(keyword.replace('@',''))).map(h=>({type:'user', value:h}));
    }
    if (mode === '#') {
      return hashtags.filter(h => h.startsWith(keyword.replace('#',''))).map(h=>({type:'hash', value:h}));
    }
    return [];
  },[mode, keyword]);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setFile(f);
  };

  const onCaptionChange = (e) => {
    const v = e.target.value;
    setCaption(v);
    const caret = v.slice(Math.max(0,v.lastIndexOf('\n')+1));
    const m = caret.match(/([@#][^\s]*)$/);
    if (m) { setMode(m[1][0]); setKeyword(m[1]); } else { setMode(null); setKeyword(''); }
  };

  const applySuggest = (item) => {
    const replaced = caption.replace(/([@#][^\s]*)$/, mode + item.value + ' ');
    setCaption(replaced);
    setMode(null); setKeyword('');
  };

  const [file, setFile] = useState(null);
  const clearVideo = () => {
    setFile(null);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl("");
  };

  const mut = useMutation({
    mutationFn: () => uploadClip({ file, caption }),
    onSuccess: () => router.push('/clip'),
  });

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={()=> router.push('/clip')} />
        <Title>클립 올리기</Title>
        <div />
      </TopBar>

      {!fileUrl && (
        <PickBtn onClick={()=> fileRef.current?.click()}>영상 선택</PickBtn>
      )}
      <FileInput ref={fileRef} type="file" accept="video/*" onChange={onPick} />

      {fileUrl && (
        <VideoBox>
          <VideoTag ref={videoRef} src={fileUrl} controls autoPlay playsInline muted />
          <EditBadge onClick={clearVideo}>삭제</EditBadge>
        </VideoBox>
      )}

      <CaptionWrap>
        <CaptionLabel>캡션</CaptionLabel>
        <button style={{border:'0', background:'none', color:'#ff8a00', padding:'8px 0'}} onClick={()=> router.push('/upload/caption')}>캡션 추가…</button>
        {caption?.trim() && (<CaptionPreview>{caption}</CaptionPreview>)}
      </CaptionWrap>

      {showSuggest && (
        <Suggestions>
          {mentionData.map((it, idx) => (
            <SuggestItem key={idx} onClick={()=> applySuggest(it)}>
              {it.type === 'user' ? <Avatar /> : <HashIcon>#</HashIcon>}
              <div>{it.type === 'user' ? '@' : '#'}{it.value}</div>
            </SuggestItem>
          ))}
        </Suggestions>
      )}

      <AgreeRow>
        <Checkbox type="checkbox" checked={agree} onChange={(e)=> setAgree(e.target.checked)} />
        잔치픽 순위로 상위 10명에게 공연 기회가 주어지며, 이후 본인에게 참여 의사가 달려 있음을 고지합니다
      </AgreeRow>

      <PostBar>
        <PrimaryButton disabled={!enabled || !file} onClick={()=>{ if(!file) return; mut.mutate(); }}>게시하기</PrimaryButton>
      </PostBar>
    </Container>
  );
}


