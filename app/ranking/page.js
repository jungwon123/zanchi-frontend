"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useQuery } from "@tanstack/react-query";
import { getRankingClips } from "@/app/_api/ranking";
import HlsPlayer from "@/app/clip/_components/HlsPlayer";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111; display:  auto auto 1fr auto;
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent; background-image: url('/icon/back.png'); background-position: center; background-repeat: no-repeat; background-size: contain;
`;
const Title = styled.div`
  font-weight: 900; font-size: 18px;
`;

const Banner = styled.div`
  position: sticky; top: 56px; z-index: 1;
  padding: 12px 16px; background: #ff7d0a; color: #fff;
  display: grid; grid-template-columns: 1fr auto; font-size: 14px; font-weight: 700;
`;
const Sub = styled.span`
  opacity: .9; font-weight: 600;
`;

const Podium = styled.div`
  background: #ff7d0a; color: #fff; padding: 0px 0px 16px; display: grid; grid-template-columns: repeat(3, 1fr); height: 50vh; align-items: center;
`;
const PCard = styled.button`
  position: relative; width: 100%; background: transparent; border: 0; border-radius: 18px; display: grid; grid-template-rows: 1fr auto auto auto auto; align-items: end; height: 70%;
  transform: scale(${(p)=> p.$scale || 1}); transition: transform 160ms ease; cursor: pointer;
`;
const Media = styled.div`
  width: 100%; height: 100%; border-radius: 12px; background: #bdbdbd; /* 영상 영역 자리표시자 */
`;
const AvatarRow = styled.div`
  display: grid; place-items: center; margin-top: -28px; z-index: 1;
`;
const AvatarImg = styled.img`
  width: 48px; height: 48px; border-radius: 24px; object-fit: cover; background: #ffeadb; border: 4px solid #fff;
`;
const Crown = styled.img`
  position: absolute; top: -38px; left: 50%; transform: translateX(-50%); width: ${(p)=> p.$w || 64}px; height: auto; pointer-events: none;
`;
const Name = styled.div`
  text-align: center; font-weight: 900; margin-top: 8px;
`;
const Handle = styled.div`
  text-align: center; opacity: .9; font-size: 14px;
`;
const Score = styled.div`
  text-align: center; font-weight: 900; font-size: 20px; margin-top: 8px;
`;

const List = styled.div`
  display: grid; gap: 2px; background: #f6f6f6; padding-bottom: 16px;
`;
const Row = styled.button`
  display: grid; grid-template-columns: 36px 44px 1fr auto; gap: 12px; align-items: center; border: 0; background: #fff; padding: 12px 16px; text-align: left;
`;
const RankNum = styled.div`
  font-weight: 900;
`;
const SmallThumb = styled.img`
  width: 44px; height: 44px; border-radius: 22px; object-fit: cover; background: #ffe3cd;
`;
const Col = styled.div`
  display: grid; gap: 4px;
`;
const Like = styled.div`
  color: #ff7d0a; font-weight: 800;
`;

/* 하단 고정 버튼 제거 */

// Popup
const Dim = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.45); display: ${(p)=> p.$open ? 'flex' : 'none'}; align-items: center; justify-content: center; z-index: 50;
`;
const Popup = styled.div`
  width: min(640px, 92%); background: #fff; color: #111; border-radius: 24px; padding: 24px 16px; display: grid; gap: 16px; text-align: center;
`;
const PopTitle = styled.h3`
  font-size: 24px; font-weight: 900; margin: 4px 0 8px;
`;
const PopPodium = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-items: end; padding: 8px 12px 0;
`;
const PopBtnRow = styled.div`
  display: grid; gap: 10px; padding: 4px 8px 0;
`;
const ConfirmBtn = styled.button`
  background: #eee; border: 0; height: 44px; border-radius: 12px; color: #333; font-weight: 800;
`;

export default function RankingPage(){
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ranking-clips', 0],
    queryFn: () => getRankingClips({ page: 0, size: 30 }),
    staleTime: 60_000,
  });
  const list = React.useMemo(()=> (data?.items || []).slice().sort((a,b)=> b.score - a.score), [data?.items]);

  const top3 = list.slice(0,3);
  const others = list.slice(3,30);

  // D-day (example dates)
  const today = new Date();
  const confirmDay = new Date(); confirmDay.setDate(confirmDay.getDate()+12); // D-12 in example
  const dday = Math.max(0, Math.ceil((confirmDay - today)/(1000*60*60*24)));

  const [showPopup, setShowPopup] = React.useState(false);
  const [updatedAt, setUpdatedAt] = React.useState('');
  // 확정 "당일"에만 모달 노출
  React.useEffect(()=>{
    const dayDiff = Math.floor((confirmDay.setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / (1000*60*60*24));
    if (dayDiff === 0) setShowPopup(true);
  },[]);
  React.useEffect(()=>{ setUpdatedAt(new Date().toLocaleString()); },[]);

  const openClip = (clipId, uploaderId) => router.push(`/clip/view?userId=${uploaderId}&clipId=${clipId}`);
  const goBuy = () => router.push('/payment');

  return (
    <Wrap>
      <TopBar>
        <BackBtn aria-label="back" onClick={()=> router.push('/clip')} />
        <Title>잔치러 랭킹</Title>
      </TopBar>

      <Banner>
        <div suppressHydrationWarning>업데이트 {updatedAt || '-'}</div>
        <div><Sub>잔치러 확정까지</Sub> D-{dday}</div>
      </Banner>

      <Podium>
        {(() => {
          const order = [top3[1], top3[0], top3[2]].filter(Boolean);
          return order.map((u, idx) => {
            const crowns = ['/icon/2nd.png','/icon/1st.png','/icon/3rd.png'];
            const widths = [54, 72, 54];
            return (
              <PCard key={u.id} $scale={idx===1?1:0.8} onClick={()=> openClip(u.clipId, u.uploaderId)}>
                <Crown src={crowns[idx]} alt="crown" $w={widths[idx]} />
                <Media as="div" style={{ position:'relative', overflow:'hidden' }}>
                  <div style={{position:'absolute', inset:0}}>
                    <HlsPlayer src={u.src} autoPlay muted playsInline />
                  </div>
                </Media>
                <AvatarRow>
                  <AvatarImg src={u.avatarUrl || '/icon/default.png'} alt="profile" />
                </AvatarRow>
                <Name>{u.name}</Name>
                <Handle>{u.handle}</Handle>
                <Score>{(u.score).toLocaleString()}</Score>
              </PCard>
            );
          });
        })()}
      </Podium>

      <List>
        {others.map((u, i)=> (
          <Row key={u.id} onClick={()=> openClip(u.clipId, u.uploaderId)}>
            <RankNum>{i+4}</RankNum>
            <SmallThumb src={u.avatarUrl || '/icon/default.png'} alt="" />
            <Col>
              <div style={{fontWeight:800}}>{u.name}</div>
              <div style={{opacity:.7}}>{u.handle}</div>
            </Col>
            <Like>{(u.score/1000).toFixed(1)}k ❤</Like>
          </Row>
        ))}
      </List>

      {/* 하단 고정 버튼 제거됨 */}

      {/* Final ranking popup */}
      <Dim $open={showPopup} onClick={()=> setShowPopup(false)}>
        <Popup onClick={(e)=> e.stopPropagation()}>
          <PopTitle>잔치러 순위가 정해졌어요!</PopTitle>
          <PopPodium>
            {top3.map((u, idx)=> (
              <div key={`p${u.id}`} style={{display:'grid', placeItems:'center', gap:6}}>
                <SmallThumb src={u.avatarUrl || '/icon/default.png'} alt="" style={{width:64, height:64, borderRadius:32}} />
                <div style={{fontWeight:800}}>{u.name}</div>
                <div style={{opacity:.7}}>{u.handle}</div>
              </div>
            ))}
          </PopPodium>
          <PopBtnRow>
            <PrimaryButton onClick={()=> { setShowPopup(false); goBuy(); }}>잔치 예매하러 가기</PrimaryButton>
            <ConfirmBtn onClick={()=> setShowPopup(false)}>확인</ConfirmBtn>
          </PopBtnRow>
        </Popup>
      </Dim>
    </Wrap>
  );
}


