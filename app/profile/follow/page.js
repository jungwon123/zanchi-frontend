"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  min-height: 100svh; background: #fff; color: #111;
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; padding: 12px 16px;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent; background-image: url('/icon/back.png'); background-position: center; background-repeat: no-repeat; background-size: contain;
`;

const Tabs = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 0 16px;
`;
const TabBtn = styled.button`
  height: 42px; border: 0; background: #fff; font-weight: 900; color: ${(p)=> p.$active ? '#111' : '#777'}; position: relative;
  &::after{ content:""; position: absolute; left: 50%; transform: translateX(-50%); bottom: 0; height: 3px; width: ${(p)=> p.$active ? '60%' : '0'}; background: #ff7d0a; transition: width 160ms ease; }
`;

const SearchRow = styled.div`
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;
`;
const SearchWrap = styled.div`
  height: 44px; border-radius: 22px; background: #f4f4f4; display: grid; grid-template-columns: 36px 1fr; align-items: center; padding: 0 12px; color: #999;
`;
const SearchIcon = styled.span`
  width: 20px; height: 20px; background: url('/icon/tabler_search.png') center/contain no-repeat;
`;
const SearchInput = styled.input`
  border: 0; background: transparent; outline: none; font-size: 16px; color: #111;
`;
const CancelBtn = styled.button`
  border: 0; background: transparent; color: #999; font-weight: 700;
`;

const List = styled.div`
  padding: 12px 16px; display: grid; gap: 18px;
`;
const Item = styled.button`
  display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; border: 0; background: #fff; text-align: left;
`;
const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #ffb26e;
`;
const NameWrap = styled.div`
  display: grid; gap: 4px;
`;
const Nick = styled.div`
  font-weight: 800;
`;
const Handle = styled.div`
  color: #666; font-size: 14px;
`;

export default function FollowListPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState('followers');
  const [q, setQ] = React.useState('');

  const followers = React.useMemo(() => new Array(12).fill(0).map((_,i)=>({ id:`f${i}`, nick:`노래좋은 잔치러`, handle:`like_singing${i}`})), []);
  const following = React.useMemo(() => new Array(8).fill(0).map((_,i)=>({ id:`g${i}`, nick:`노래만 합니다`, handle:`just_song${i}`})), []);

  const data = (tab==='followers' ? followers : following).filter(u => u.nick.includes(q) || u.handle.includes(q));

  return (
    <Container>
      <TopBar>
        <BackBtn aria-label="back" onClick={()=> router.back()} />
      </TopBar>

      <Tabs>
        <TabBtn $active={tab==='followers'} onClick={()=> setTab('followers')}>1.2k 팔로워</TabBtn>
        <TabBtn $active={tab==='following'} onClick={()=> setTab('following')}>387 팔로잉</TabBtn>
      </Tabs>

      <SearchRow>
        <SearchWrap>
          <SearchIcon />
          <SearchInput value={q} onChange={(e)=> setQ(e.target.value)} placeholder="노래" />
        </SearchWrap>
        <CancelBtn onClick={()=> setQ('')}>취소</CancelBtn>
      </SearchRow>

      <List>
        {data.map((u)=> (
          <Item key={u.id} onClick={()=> router.push('/profile')}>
            <Avatar />
            <NameWrap>
              <Nick>{u.nick}</Nick>
              <Handle>@{u.handle}</Handle>
            </NameWrap>
          </Item>
        ))}
      </List>
    </Container>
  );
}

// 초기 탭 동기화
if (typeof window !== 'undefined') {
  // Next.js strict mode mounts twice; keep simple read with timeout to ensure client
}


