"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Container, TopBar, SearchWrap, SearchInput, SearchIcon, CancelBtn, Section, SectionTitle, Chips, Chip, ChipRemove, Grid, Card, Thumb, PlayBadge, MetaRow, Avatar, MetaText, TabsBar, TabBtn, PagesWrap, PagesInner, PagePane, AccountsList, AccountItem, AccountAvatar, AccountText, SortBar, SortChip } from "./_styles";

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState(["노래하는 잔치러", "버스킹 공연", "학교 밴드부", "추가항목"]);
  const recent3 = useMemo(() => recent.slice(0, 3), [recent]);
  const [tab, setTab] = useState(1); // 0: 계정, 1: 클립
  const [clipSort, setClipSort] = useState("relevance");

  useEffect(() => { /* focus could be handled here if needed */ }, []);

  const removeRecent = (idx) => {
    setRecent((list) => list.filter((_, i) => i !== idx));
  };

  const viewed = new Array(4).fill(0).map((_, i) => ({ id: `v${i}`, user: "노래듣는중", handle: "@listen_to_music", plays: 87 }));

  return (
    <Container>
      <TopBar>
        <SearchWrap>
        <SearchIcon src="/icon/tabler_search.png" alt="검색" />

          <SearchInput
            placeholder="검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
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
              <Card key={v.id} onClick={() => router.push("/clip")}>
                <Thumb>
                  <PlayBadge>{v.plays} ▶</PlayBadge>
                </Thumb>
                <MetaRow>
                  <Avatar />
                  <MetaText>
                    <strong>{v.user}</strong>
                    <span>{v.handle}</span>
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
                  {["노래좋은 잔치러","노래방 가자","노래만 합니다","노래듣는중","노래가 하고싶니","노래만듦"].map((name,i)=> (
                    <AccountItem key={i}>
                      <AccountAvatar />
                      <AccountText>
                        <strong>{name}</strong>
                        <span>@{name.replaceAll(' ','_').toLowerCase()}</span>
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
                  {viewed.map((v) => (
                    <Card key={v.id} onClick={() => router.push("/clip")}>
                      <Thumb>
                        <PlayBadge>{v.plays} ▶</PlayBadge>
                      </Thumb>
                      <MetaRow>
                        <Avatar />
                        <MetaText>
                          <strong>{v.user}</strong>
                          <span>{v.handle}</span>
                        </MetaText>
                      </MetaRow>
                    </Card>
                  ))}
                </Grid>
              </PagePane>
            </PagesInner>
          </PagesWrap>
        </>
      )}
    </Container>
  );
}


