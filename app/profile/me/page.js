"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Container, TopBar, Title, SettingsBtn, Avatar, Handle, StatsRow, ActionsRow, ActionBtn, Tabs, TabBtn, Grid, Card, ViewsBadge } from "./_styles";
import HlsPlayer from "@/app/clip/_components/HlsPlayer";
import BottomNav from "@/app/_components/BottomNav";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMySummary, getFollowCounts, getMyClips, getSavedClips, getPickedClips, uploadAvatar } from "@/app/_api/profile";

export default function MyProfilePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState('mine');
  const fileInputRef = React.useRef(null);
  const queryClient = useQueryClient();
  const { data: me } = useQuery({ queryKey: ['me-summary'], queryFn: getMySummary });
  const { data: counts } = useQuery({ queryKey: ['me-counts', me?.id], queryFn: () => getFollowCounts(me.id), enabled: !!me?.id });
  const { data: myClips } = useQuery({ queryKey: ['me-clips', 0], queryFn: () => getMyClips({ page: 0, size: 50 }) });
  const { data: savedClips } = useQuery({ queryKey: ['me-saved', 0], queryFn: () => getSavedClips({ page: 0, size: 50 }) });
  const { data: pickedClips } = useQuery({ queryKey: ['me-picks', 0], queryFn: () => getPickedClips({ page: 0, size: 50 }) });

  const toAbsoluteUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
    const baseTrimmed = base.replace(/\/+$/, "");
    const pathTrimmed = String(url).replace(/^\/+/, "");
    return `${baseTrimmed}/${pathTrimmed}`;
  };
  const listMine = (myClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount, src: toAbsoluteUrl(c.videoUrl), uploaderId: me?.id }));
  const listSaved = (savedClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount, src: toAbsoluteUrl(c.videoUrl), uploaderId: c.uploaderId }));
  const listPicked = (pickedClips?.content || []).map((c) => ({ id: c.id, views: c.viewCount, src: toAbsoluteUrl(c.videoUrl), uploaderId: c.uploaderId }));
  const clips = tab === 'mine' ? listMine : tab === 'saved' ? listSaved : listPicked;

  const onClickAvatar = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onChangeFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const { avatarUrl } = await uploadAvatar(file);
      queryClient.setQueryData(['me-summary'], (old) => ({ ...(old || {}), avatarUrl }));
    } catch (err) {
      console.error(err);
      alert('아바타 업로드에 실패했습니다.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Container>
      <TopBar>
        <Title>내 정보</Title>
      </TopBar>

      <Avatar onClick={onClickAvatar} style={{ backgroundImage: `url(${me?.avatarUrl ? toAbsoluteUrl(me.avatarUrl) : '/icon/default.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onChangeFile} />
      <Handle>@{me?.name || me?.loginId || 'me'}</Handle>
      <StatsRow>
        <div><strong>{counts?.posts ?? 0}</strong><span>게시물</span></div>
        <div onClick={()=> me?.id && router.push(`/profile/follow?userId=${me.id}`)} style={{cursor:'pointer'}}><strong>{counts?.followers ?? 0}</strong><span>팔로워</span></div>
        <div onClick={()=> me?.id && router.push(`/profile/follow?userId=${me.id}`)} style={{cursor:'pointer'}}><strong>{counts?.following ?? 0}</strong><span>팔로잉</span></div>
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
          <Card key={c.id} onClick={()=> router.push(`/clip/view?userId=${tab==='mine' ? me.id : c.uploaderId}&clipId=${c.id}`)}>
            <HlsPlayer src={c.src} autoPlay muted />
            <ViewsBadge>▶ {c.views}</ViewsBadge>
          </Card>
        ))}
      </Grid>

      <BottomNav current="me" />
    </Container>
  );
}


