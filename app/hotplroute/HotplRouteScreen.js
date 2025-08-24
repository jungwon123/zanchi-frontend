"use client";

import { useState } from "react";
import { Screen, TopBar, BackBtn, ClipBtn, ClipIcon, TitleCenter, Main, IntroText, Illustration, BottomActions, RoundBtn, CtaBtn, Slides, Slide, SectionTitle, TwoCols, GhostBtn, ButtonsRow, FourGrid, BottomBar, LoaderWrap, LoaderLogo, LoaderIcon, LoaderText, ResultWrap, ResultTop, DateText, EditBtn, Places, PlaceItem, Thumb, PlaceTitle, RatingRow, Star, AddrRow, MarkerBadge, MapBox, BottomActionsRow, SavesWrap, SavesHeader, SaveItem, SaveIcon, SaveTitle, SaveDesc } from "./_styles";
import PrimaryButton from "../_components/PrimaryButton";

export default function HotplRouteScreen() {
  const [view, setView] = useState('start'); // 'start' | 'venue' | 'with' | 'category' | 'saves'
  const [selected, setSelected] = useState({ venue: null, with: null, categories: new Set(), sub: new Set() });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0~100
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null); // 로딩 완료 후 결과 존재
  const [saves, setSaves] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hotpl_saves') || '[]'); } catch { return []; }
  });
  const [dateText, setDateText] = useState('2025.08.25');

  const baseCats = ['볼거리','놀거리','쉴거리','먹을거리'];
  const subMap = {
    '볼거리': ['전시','자연','시장','지역문화'],
    '놀거리': ['지역문화','공방'],
    '쉴거리': ['공원','도서관','카페'],
    '먹을거리': ['점심식사','저녁식사','브런치','커피','디저트','술'],
  };

  const toggleCategory = (cat) => {
    setSelected((s) => {
      const next = new Set(s.categories);
      if (next.has(cat)) {
        next.delete(cat);
        // 해당 카테고리의 소분류 제거 (cat|name 키 기준)
        const nextSub = new Set([...s.sub].filter((x) => !x.startsWith(cat + '|')));
        return { ...s, categories: next, sub: nextSub };
      }
      next.add(cat);
      return { ...s, categories: next };
    });
  };

  const subKey = (cat, name) => `${cat}|${name}`;

  const toggleSub = (cat, name) => {
    setSelected((s) => {
      const next = new Set(s.sub);
      const key = subKey(cat, name);
      if (next.has(key)) next.delete(key); else if (next.size < 4) next.add(key);
      return { ...s, sub: next };
    });
  };

  const mockPlaces = [
    { id: 'p1', title: '신포국제시장', thumb: 'https://picsum.photos/seed/101/240/240', rating: 4.43, addr: '인천 중구 신포동 6-6' },
    { id: 'p2', title: '신포공갈빵', thumb: 'https://picsum.photos/seed/102/240/240', rating: 4.36, addr: '인천 중구 우현로49번길 14' },
    { id: 'p3', title: '카페맑음', thumb: 'https://picsum.photos/seed/103/240/240', rating: 4.68, addr: '인천 중구 신포로 32-21' },
    { id: 'p4', title: '뜬돌집', thumb: 'https://picsum.photos/seed/104/240/240', rating: 4.89, addr: '인천 중구 우현로45번길 30-11층' },
  ];
  return (
    <Screen>
      <TopBar>
        {view === 'venue' && (
          <BackBtn aria-label="back" onClick={() => setView('start')}>‹</BackBtn>
        )}
        <TitleCenter>핫플루트</TitleCenter>
        <ClipBtn aria-label="to-clip" onClick={() => { window.location.href = '/clip'; }}>
          <ClipIcon />
          <span style={{ color: '#ff8a00', fontWeight: 700 }}>클립</span>
        </ClipBtn>
      </TopBar>

      {/* 본문: 뷰 전환 */}
      {!result && (
      <Slides>
        <Slide $active={view === 'start'} $dir="right">
          <Main $center>
            <IntroText>
              <div>AI가 000님의 취향을 분석해</div>
              <div>맞춤형 루트를 추천해요</div>
            </IntroText>
            <div style={{ marginTop: 28 }}>
              <Illustration />
            </div>
          </Main>
          <BottomActions>
            <RoundBtn aria-label="menu" onClick={()=> setView('saves')}>
              <span style={{ display: 'inline-block', width: 24, height: 24, borderTop: '3px solid #fff', borderBottom: '3px solid #fff', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, right: 0, top: 8, borderTop: '3px solid #fff' }} />
              </span>
            </RoundBtn>
            <CtaBtn onClick={() => setView('venue')}>루트 만들기</CtaBtn>
          </BottomActions>
        </Slide>

        <Slide $active={view === 'venue'} $dir="right">
          <Main>
            <SectionTitle>잔치가 어디에서 열리나요?</SectionTitle>
            <TwoCols>
              {['다락소극장','신포아트홀'].map((t) => (
                <GhostBtn key={t} $active={selected.venue === t} onClick={() => { setSelected((s)=>({ ...s, venue: t })); setView('with'); }}>{t}</GhostBtn>
              ))}
            </TwoCols>
          </Main>
        </Slide>

        <Slide $active={view === 'with'} $dir="right">
          <Main>
            <SectionTitle>누구랑 잔치를 보러왔나요?</SectionTitle>
            <ButtonsRow>
              {['가족','친구','연인','혼자'].map((t) => (
                <GhostBtn key={t} $active={selected.with === t} onClick={() => { setSelected((s)=>({ ...s, with: t })); setView('category'); }}>{t}</GhostBtn>
              ))}
            </ButtonsRow>
          </Main>
        </Slide>

        <Slide $active={view === 'category'} $dir="right">
          <Main>
            <SectionTitle>어디를 가고싶나요?</SectionTitle>
            <FourGrid>
              {baseCats.map((t) => (
                <GhostBtn key={t} $mid={selected.categories.has(t)} $active={false} onClick={() => toggleCategory(t)}>{t}</GhostBtn>
              ))}
            </FourGrid>
            {/* 선택된 카테고리들의 소분류를 순서대로 출력 */}
            {baseCats.filter((c) => selected.categories.has(c)).map((c) => (
              <div key={c} style={{ marginTop: 16 }}>
                <SectionTitle style={{ fontSize: 18, margin: '24px 0 12px' }}>{c}</SectionTitle>
                <ButtonsRow>
                  {(subMap[c] || []).map((s) => (
                    <GhostBtn key={c + ':' + s} $active={selected.sub.has(subKey(c, s))} onClick={() => toggleSub(c, s)}>{s}</GhostBtn>
                  ))}
                </ButtonsRow>
              </div>
            ))}
            <BottomBar>
              <PrimaryButton
                disabled={selected.sub.size === 0 || selected.sub.size > 4}
                onClick={() => {
                  setLoading(true);
                  setProgress(0);
                  setLoadingStep(0);
                  // 모의 진행도와 문구 교체
                  const t0 = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 60);
                  const script = [
                    '사용자를 위한 루트를 만들고 있어요',
                    '핫플루트를 생성하는 중이에요',
                    '지역 사회 활성화의 주인공이 되는 중이에요',
                  ];
                  let idx = 0;
                  setLoadingStep(idx);
                  const t1 = setInterval(() => {
                    idx = Math.min(script.length - 1, idx + 1);
                    setLoadingStep(idx);
                    if (idx === script.length - 1) clearInterval(t1);
                  }, 1200);
                  // 완료 가정 타이머
                  setTimeout(() => { clearInterval(t0); setProgress(100); setTimeout(()=>{ setLoading(false); setResult({ items: mockPlaces }); }, 400); }, 4500);
                }}
              >
                완료
              </PrimaryButton>
            </BottomBar>
          </Main>
        </Slide>
      </Slides>
      )}
      {result && !loading && (
        <ResultWrap>
          <ResultTop>
            <DateText value={dateText} onChange={(e)=>setDateText(e.target.value)} />
            <EditBtn onClick={()=>{ const v = prompt('날짜를 입력하세요 (YYYY.MM.DD)', dateText); if (v) setDateText(v); }} />
          </ResultTop>
          <Places>
            {result.items.map((p, i) => (
              <PlaceItem key={p.id}>
                <Thumb style={{ backgroundImage: `url(${p.thumb})` }} />
                <div>
                  <PlaceTitle>{p.title}</PlaceTitle>
                  <RatingRow><Star>★</Star><div>{p.rating?.toFixed(2)}</div></RatingRow>
                  <AddrRow><MarkerBadge>{String.fromCharCode(65 + i)}</MarkerBadge><div>{p.addr}</div></AddrRow>
                </div>
              </PlaceItem>
            ))}
            <MapBox />
          </Places>
          <BottomActionsRow>
            <RoundBtn aria-label="back" onClick={()=>{ setResult(null); setView('category'); }}>↺</RoundBtn>
            <PrimaryButton onClick={()=>{
              // 저장 로직
              const entry = {
                id: Date.now(),
                title: dateText,
                desc: '다락소극장, 가족, 도보, 볼거리, 먹을거리',
                items: result.items,
              };
              const next = [entry, ...saves].slice(0, 20);
              setSaves(next);
              try { localStorage.setItem('hotpl_saves', JSON.stringify(next)); } catch {}
              // 저장 완료 UI 후 초기 화면으로 이동
              const btn = document.activeElement; if (btn) btn.textContent = '저장완료';
              setTimeout(()=>{ setResult(null); setView('start'); if (btn) btn.textContent = '저장하기'; }, 900);
            }}>저장하기</PrimaryButton>
          </BottomActionsRow>
        </ResultWrap>
      )}
      {view === 'saves' && !result && !loading && (
        <SavesWrap>
          <SavesHeader>저장 목록</SavesHeader>
          {saves.map((s) => (
            <SaveItem key={s.id} onClick={()=>{ setResult({ items: s.items }); setView(''); }}>
              <SaveIcon />
              <div>
                <SaveTitle>{s.title}</SaveTitle>
                <SaveDesc>{s.desc}</SaveDesc>
              </div>
            </SaveItem>
          ))}
          {saves.length === 0 && <div style={{ color: '#888', padding: '16px 0' }}>저장된 항목이 없습니다.</div>}
        </SavesWrap>
      )}
      {loading && (
        <LoaderWrap role="dialog" aria-label="루트 생성중">
          <LoaderLogo>핫플루트</LoaderLogo>
          <LoaderIcon />
          <LoaderText>
            {['사용자를 위한 루트를 만들고 있어요','핫플루트를 생성하는 중이에요','지역 사회 활성화의 주인공이 되는 중이에요'][loadingStep]}
          </LoaderText>
        </LoaderWrap>
      )}
    </Screen>
  );
}


