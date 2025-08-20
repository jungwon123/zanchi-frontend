"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../_state/atoms";
import { Container, TopBar, BackBtn, HandleText, Avatar, Nickname, StatsRow, ActionsRow, PrimaryBtn, SecondaryBtn, Grid, ClipCard, ViewsBadge } from "./_styles";
import ShareSheet from "../clip/_components/ShareSheet";
import BottomNav from "../_components/BottomNav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRelation, toggleFollow, getMemberClips, getFollowCounts } from "@/app/_api/profile";

export default function ProfilePage() {
  const router = useRouter();
  const userId = 12; // TODO: 실제 프로필 대상 ID 주입
  const qc = useQueryClient();
  const { data: rel } = useQuery({ queryKey: ['rel', userId], queryFn: () => getRelation(userId) });
  const { data: counts } = useQuery({ queryKey: ['counts', userId], queryFn: () => getFollowCounts(userId) });
  const { data: clipsData } = useQuery({ queryKey: ['member-clips', userId, 0], queryFn: () => getMemberClips(userId, { page: 0, size: 50 }) });
  const [following, setFollowing] = useState(Boolean(rel?.following));
  const [pressed, setPressed] = useState(false);
  const openShare = useSetRecoilState(shareOpenState);

  const clips = (clipsData?.content || []).map((c) => ({ id: c.id, views: c.viewCount }));

  const followMut = useMutation({
    mutationFn: () => toggleFollow(userId),
    onSuccess: (res) => {
      setFollowing(Boolean(res?.following));
      qc.invalidateQueries({ queryKey: ['rel', userId] });
      qc.invalidateQueries({ queryKey: ['counts', userId] });
    }
  });

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
          onClick={() => followMut.mutate()}
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



