"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Container, TopBar, Title, SettingsBtn, Avatar, Handle, StatsRow, ActionsRow, ActionBtn, Tabs, TabBtn, Grid, Card, ViewsBadge } from "./_styles";
import BottomNav from "@/app/_components/BottomNav";

export default function MyProfilePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState('mine');
  const clips = new Array(12).fill(0).map((_, i) => ({ id: `m${i}`, views: 87 }));

  return (
    <Container>
      <TopBar>
        <Title>내 정보</Title>
      </TopBar>

      <Avatar />
      <Handle>@노래하는 잔치러</Handle>
      <StatsRow>
        <div><strong>10</strong><span>게시물</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>999</strong><span>팔로워</span></div>
        <div onClick={()=> router.push('/profile/follow')} style={{cursor:'pointer'}}><strong>87</strong><span>팔로잉</span></div>
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


