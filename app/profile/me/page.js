"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Container, TopBar, Title, SettingsBtn, Avatar, Handle, StatsRow, ActionsRow, ActionBtn, Tabs, TabBtn, Grid, Card, ViewsBadge } from "./_styles";
import BottomNav from "@/app/_components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { getMySummary, getFollowCounts, getMyClips, getSavedClips, getPickedClips } from "@/app/_api/profile";

export default function MyProfilePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState('mine');
  const { data: me } = useQuery({ queryKey: ['me-summary'], queryFn: getMySummary });
  const { data: counts } = useQuery({ queryKey: ['me-counts', me?.id], queryFn: () => getFollowCounts(me.id), enabled: !!me?.id });
  const { data: myClips } = useQuery({ queryKey: ['me-clips', 0], queryFn: () => getMyClips({ page: 0, size: 50 }) });
  const { data: savedClips } = useQuery({ queryKey: ['me-saved', 0], queryFn: () => getSavedClips({ page: 0, size: 50 }) });
  const { data: pickedClips } = useQuery({ queryKey: ['me-picks', 0], queryFn: () => getPickedClips({ page: 0, size: 50 }) });

  const listMine = (myClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount }));
  const listSaved = (savedClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount }));
  const listPicked = (pickedClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount }));
  const clips = tab === 'mine' ? listMine : tab === 'saved' ? listSaved : listPicked;

  return (
    <Container>
      <TopBar>
        <Title>내 정보</Title>
      </TopBar>

      <Avatar style={{ backgroundImage: me?.avatarUrl ? `url(${me.avatarUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <Handle>@{me?.loginId || 'me'}</Handle>
      <StatsRow>
        <div><strong>{counts?.posts ?? 0}</strong><span>게시물</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>{counts?.followers ?? 0}</strong><span>팔로워</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>{counts?.following ?? 0}</strong><span>팔로잉</span></div>
      </StatsRow>

      <ActionsRow>
        <ActionBtn $primary onClick={()=> router.push('/profile/edit')}>프로필 편집</ActionBtn>
        <ActionBtn onClick={()=> router.push('/profile/share')}>프로필 공유</ActionBtn>
      </ActionsRow>

      <Tabs>
        <TabBtn $active={tab==='mine'} onClick={()=> setTab('mine')}>내 클립</TabBtn>
        <TabBtn $active={tab==='saved'} onClick={()=> setTab('saved')}>저장한 클립</TabBtn>
        <TabBtn $active={tab==='pick'} onClick={()=> setTab('pick')}>나의 잔치픽</TabBtn>
      </Tabs>

      <Grid>
        {clips.map((c)=> (
          <Card key={c.id} onClick={()=> router.push('/clip')}>
            <ViewsBadge>▶ {c.views}</ViewsBadge>
          </Card>
        ))}
      </Grid>

      <BottomNav current="me" />
    </Container>
  );
}


