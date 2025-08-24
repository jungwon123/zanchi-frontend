"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../_state/atoms";
import { Container, TopBar, BackBtn, HandleText, Avatar, Nickname, StatsRow, ActionsRow, PrimaryBtn, SecondaryBtn, Grid, ClipCard, ViewsBadge } from "./_styles";
import ShareSheet from "../clip/_components/ShareSheet";
import BottomNav from "../_components/BottomNav";
import HlsPlayer from "../clip/_components/HlsPlayer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRelation, toggleFollow, unfollow, getMemberClips, getFollowCounts } from "@/app/_api/profile";

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div style={{ color: '#999', padding: 16 }}>로딩중…</div>}>
      <ProfileInner />
    </React.Suspense>
  );
}

function ProfileInner() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = Number(params.get('userId')) || 0;
  const qc = useQueryClient();
  const { data: rel } = useQuery({ queryKey: ['rel', userId], queryFn: () => getRelation(userId) });
  const { data: counts } = useQuery({ queryKey: ['counts', userId], queryFn: () => getFollowCounts(userId) });
  const { data: clipsData } = useQuery({ queryKey: ['member-clips', userId, 0], queryFn: () => getMemberClips(userId, { page: 0, size: 50 }) });
  const [following, setFollowing] = useState(Boolean(rel?.following));
  const [pressed, setPressed] = useState(false);
  const openShare = useSetRecoilState(shareOpenState);

  const toAbsoluteUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
    const baseTrimmed = base.replace(/\/+$/, "");
    const pathTrimmed = String(url).replace(/^\/+/, "");
    return `${baseTrimmed}/${pathTrimmed}`;
  };

  const clips = (clipsData?.content || []).map((c) => ({ id: c.id, views: c.viewCount, src: toAbsoluteUrl(c.videoUrl) }));
  const displayName = (clipsData?.content?.[0]?.authorName) || '사용자';
  const avatarUrl = (clipsData?.content?.[0]?.uploaderAvatarUrl) || '';

  // rel 쿼리 결과가 바뀌면 버튼 상태 동기화
  if (Boolean(rel?.following) !== following) {
    // 렌더 중 setState 방지: 다음 틱으로 연기
    Promise.resolve().then(() => setFollowing(Boolean(rel?.following)));
  }

  const followMut = useMutation({
    mutationFn: () => (following ? unfollow(userId) : toggleFollow(userId)),
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
        <HandleText>@{displayName}</HandleText>
      </TopBar>

      <Avatar style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <Nickname>{displayName}</Nickname>
      <StatsRow>
        <div><strong>{counts?.posts ?? 0}</strong><span>게시물</span></div>
        <div onClick={()=> router.push(`/profile/follow?userId=${userId}`)} style={{cursor:'pointer'}}><strong>{counts?.followers ?? 0}</strong><span>팔로워</span></div>
        <div onClick={()=> router.push(`/profile/follow?userId=${userId}`)} style={{cursor:'pointer'}}><strong>{counts?.following ?? 0}</strong><span>팔로잉</span></div>
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
            <ClipCard key={c.id} onClick={() => router.push(`/clip/view?userId=${userId}&index=${clips.findIndex((x) => x.id === c.id)}`)}>
            <HlsPlayer src={c.src} autoPlay muted />
            <ViewsBadge>▶ {c.views}</ViewsBadge>
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



