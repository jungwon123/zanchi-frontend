"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../_state/atoms";
import { Container, TopBar, BackBtn, HandleText, Avatar, Nickname, StatsRow, ActionsRow, PrimaryBtn, SecondaryBtn, Grid, ClipCard, ViewsBadge } from "./_styles";
import ShareSheet from "../clip/_components/ShareSheet";
import BottomNav from "../_components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [pressed, setPressed] = useState(false);
  const openShare = useSetRecoilState(shareOpenState);

  const clips = new Array(12).fill(0).map((_, i) => ({ id: `c${i}`, views: 87 }));

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={() => router.push('/clip')} />
        <HandleText>sing_zanchi</HandleText>
      </TopBar>

      <Avatar />
      <Nickname>노래하는 잔치러</Nickname>
      <StatsRow>
        <div><strong>10</strong><span>게시물</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>1.2k</strong><span>팔로워</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>387</strong><span>팔로잉</span></div>
      </StatsRow>

      <ActionsRow>
        <PrimaryBtn
          $pressed={pressed}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onClick={() => setFollowing((v)=>!v)}
          style={{ background: following ? '#eee' : '#ff8a00', color: following ? '#333' : '#fff' }}
        >
          {following ? '팔로잉' : '팔로우'}
        </PrimaryBtn>
        <SecondaryBtn onClick={() => openShare(true)}>프로필 공유</SecondaryBtn>
      </ActionsRow>

      <Grid>
        {clips.map((c) => (
          <ClipCard key={c.id} onClick={() => router.push('/clip')}>
            <ViewsBadge>{c.views} ▶</ViewsBadge>
          </ClipCard>
        ))}
      </Grid>

      {/* 공유 시트 재사용 */}
      <ShareSheet />
      <BottomNav current="me" />
    </Container>
  );
}

// metadata는 Client Component에서 export할 수 없습니다. 필요하면 app/profile/layout.js에서 서버 컴포넌트로 정의하세요.



