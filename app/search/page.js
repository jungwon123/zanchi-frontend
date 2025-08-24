"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMembers, searchClips } from "@/app/_api/search";
import { Container, TopBar, SearchWrap, SearchInput, SearchIcon, CancelBtn, Section, SectionTitle, Chips, Chip, ChipRemove, Grid, Card, Thumb, PlayBadge, MetaRow, Avatar, MetaText, TabsBar, TabBtn, PagesWrap, PagesInner, PagePane, AccountsList, AccountItem, AccountAvatar, AccountText, SortBar, SortChip } from "./_styles";
import HlsPlayer from "@/app/clip/_components/HlsPlayer";

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState([]);
  const recent3 = useMemo(() => recent.slice(0, 3), [recent]);
  const [tab, setTab] = useState(1); // 0: 계정, 1: 클립
  const [clipSort, setClipSort] = useState("relevance");

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem('search_recent') || '[]');
      if (Array.isArray(r)) setRecent(r);
      const v = JSON.parse(localStorage.getItem('search_viewed') || '[]');
      if (Array.isArray(v)) setViewed(v);
    } catch {}
  }, []);

  const saveRecent = (word) => {
    setRecent((list) => {
      const trimmed = (word || '').trim();
      if (!trimmed) return list;
      const next = [trimmed, ...list.filter((w) => w !== trimmed)].slice(0, 10);
      try { localStorage.setItem('search_recent', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const removeRecent = (idx) => {
    setRecent((list) => {
      const next = list.filter((_, i) => i !== idx);
      try { localStorage.setItem('search_recent', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [viewed, setViewed] = useState([]);
  const addViewed = (item) => {
    setViewed((list) => {
      const key = `${item.id}_${item.uploaderId}`;
      const next = [item, ...list.filter((x) => `${x.id}_${x.uploaderId}` !== key)].slice(0, 12);
      try { localStorage.setItem('search_viewed', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toAbsoluteUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
    const baseTrimmed = base.replace(/\/+$/, "");
    const pathTrimmed = String(url).replace(/^\/+/, "");
    return `${baseTrimmed}/${pathTrimmed}`;
  };

  const trimmed = q.trim();
  const { data: memberRes, isFetching: fetchingMembers } = useQuery({
    queryKey: ['search-members', trimmed, 0],
    queryFn: () => searchMembers({ q: trimmed, page: 0, size: 20 }),
    enabled: trimmed.length > 0 && tab === 0,
    staleTime: 30_000,
  });
  const { data: clipRes, isFetching: fetchingClips } = useQuery({
    queryKey: ['search-clips', trimmed, 0, clipSort],
    queryFn: () => searchClips({ q: trimmed, page: 0, size: 20, sort: clipSort }),
    enabled: trimmed.length > 0 && tab === 1,
    staleTime: 30_000,
  });

  return (
    <Container>
      <TopBar>
        <SearchWrap>
        <SearchIcon src="/icon/tabler_search.png" alt="검색" />

          <SearchInput
            placeholder="검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { saveRecent(q); } }}
          />
        </SearchWrap>
        <CancelBtn onClick={() => router.push("/clip")}>취소</CancelBtn>
      </TopBar>

      {q.trim().length === 0 && (
        <Section>
          <SectionTitle>최근 검색어</SectionTitle>
          <Chips>
            {recent3.map((word, idx) => (
              <Chip key={word+idx}>
                {word}
                <ChipRemove onClick={() => removeRecent(idx)}>×</ChipRemove>
              </Chip>
            ))}
          </Chips>
        </Section>
      )}

      {q.trim().length === 0 ? (
        <Section>
          <SectionTitle>최근 본 클립</SectionTitle>
          <Grid>
            {viewed.map((v) => (
              <Card key={`${v.id}_${v.uploaderId}`} onClick={() => router.push(`/clip/view?userId=${v.uploaderId}&clipId=${v.id}`)}>
                <Thumb>
                  <HlsPlayer src={v.src} autoPlay muted />
                  <PlayBadge>{v.viewCount ?? 0} ▶</PlayBadge>
                </Thumb>
                <MetaRow>
                  <Avatar />
                  <MetaText>
                    <strong>{v.authorName}</strong>
                    <span>@u{v.uploaderId}</span>
                  </MetaText>
                </MetaRow>
              </Card>
            ))}
          </Grid>
        </Section>
      ) : (
        <>
          <TabsBar>
            <TabBtn $active={tab===0} onClick={()=>setTab(0)}>계정</TabBtn>
            <TabBtn $active={tab===1} onClick={()=>setTab(1)}>클립</TabBtn>
          </TabsBar>
          <PagesWrap>
            <PagesInner $index={tab}>
              <PagePane>
                <AccountsList>
                  {(memberRes?.content || []).map((u)=> (
                    <AccountItem key={u.id} onClick={() => router.push(`/profile?userId=${u.id}`)}>
                      <AccountAvatar style={{ backgroundImage: u.avatarUrl ? `url(${u.avatarUrl})` : undefined, backgroundSize:'cover' }} />
                      <AccountText>
                        <strong>{u.name}</strong>
                        <span>@{u.loginId}</span>
                      </AccountText>
                    </AccountItem>
                  ))}
                </AccountsList>
              </PagePane>
              <PagePane>
                <SortBar>
                  <SortChip $active={clipSort==='relevance'} onClick={()=>setClipSort('relevance')}>정확도 순</SortChip>
                  <SortChip $active={clipSort==='views'} onClick={()=>setClipSort('views')}>조회수 순</SortChip>
                </SortBar>
                <Grid>
                  {(clipRes?.content || []).map((c) => {
                    const item = {
                      id: c.id,
                      uploaderId: c.uploaderId,
                      authorName: c.authorName,
                      src: toAbsoluteUrl(c.videoUrl),
                      viewCount: c.viewCount,
                    };
                    return (
                      <Card key={c.id} onClick={() => { addViewed(item); router.push(`/clip/view?userId=${c.uploaderId}&clipId=${c.id}`); }}>
                        <Thumb>
                          <HlsPlayer src={item.src} autoPlay muted />
                          <PlayBadge>{c.viewCount} ▶</PlayBadge>
                        </Thumb>
                        <MetaRow>
                          <Avatar />
                          <MetaText>
                            <strong>{c.authorName}</strong>
                            <span>@u{c.uploaderId}</span>
                          </MetaText>
                        </MetaRow>
                      </Card>
                    );
                  })}
                </Grid>
              </PagePane>
            </PagesInner>
          </PagesWrap>
        </>
      )}
    </Container>
  );
}


