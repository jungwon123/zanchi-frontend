"use client";

import { useState, useRef } from "react";
import { Screen, TopBar, BackBtn, ClipImg, TitleCenter, Main, IntroText, Illustration, BottomActions, RoundBtn, CtaBtn, Slides, Slide, SectionTitle, TwoCols, GhostBtn, ButtonsRow, FourGrid, BottomBar, LoaderWrap, LoaderLogo, LoaderIcon, LoaderText, ResultWrap, ResultTop, DateText, EditBtn, Places, PlaceItem, Thumb, PlaceTitle, RatingRow, Star, AddrRow, MarkerBadge, BottomActionsRow, SavesWrap, SavesHeader, SaveItem, SaveIcon, SaveTitle, SaveDesc } from "./_styles";
import PrimaryButton from "../_components/PrimaryButton";
import { kakaoSearch, kakaoSearchByKeywords, aiPlan, saveRoute, getRoutes, getRoute } from "../_api/hotplroute";

export default function HotplRouteScreen() {
  const [view, setView] = useState('start'); // 'start' | 'venue' | 'with' | 'mobility' | 'category' | 'saves'
  const [selected, setSelected] = useState({ venue: null, with: null, mobility: null, categories: new Set(), sub: new Set() });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0~100
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null); // 로딩 완료 후 결과 존재
  const [saves, setSaves] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hotpl_saves') || '[]'); } catch { return []; }
  });
  const [dateText, setDateText] = useState('2025.08.25');
  const EXCLUDE_IDS = useRef([]);
  const LAST_RENDER = useRef(null);

  // Preset venues (좌표)
  const PRESET_VENUES = {
    '다락소극장': { name: '떼아뜨르다락소극장', lat: 37.473108, lng: 126.625204 },
    '신포아트홀': { name: '신포 아트홀', lat: 37.47344, lng: 126.62465 },
  };

  const RADIUS_BY_MOBILITY = { '도보': 1200, '자전거': 2500, '대중교통': 4000, '차': 6000 };

  const toBase64Id = (name, lat, lng) => {
    try { return btoa(`${name}|${lat}|${lng}`); } catch { return `${name}|${lat}|${lng}`; }
  };

  const normalize = (p, role) => ({
    id: toBase64Id(p.name, p.lat, p.lng),
    role,
    name: p.name,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    externalUrl: p.externalUrl,
    rating: p.rating,
    ratingCount: p.ratingCount,
  });

  const resolveStart = async (venue) => {
    if (!venue) return null;
    if (PRESET_VENUES[venue]) return PRESET_VENUES[venue];
    const list = await kakaoSearch({ query: venue, size: 1 });
    if (Array.isArray(list) && list[0]) {
      const it = list[0];
      return { name: venue, lat: it.lat, lng: it.lng };
    }
    return null;
  };

  const deriveKeywords = (selected) => {
    // 태그 이름 집합
    const tags = Array.from(selected.sub).map((s) => s.split('|')[1]);
    // 그룹 키워드
    const midTags = tags.filter((t) => ['전시','자연','시장','지역문화','공방','도서관','공원'].includes(t));
    const restTags = tags.filter((t) => ['점심식사','저녁식사','브런치'].includes(t));
    const finalTags = tags.filter((t) => ['카페','디저트','술'].includes(t));

    const expand = (t) => {
      switch (t) {
        case '전시': return '전시';
        case '자연': return '자연';
        case '시장': return '시장';
        case '지역문화': return '문화공간';
        case '공방': return '공방';
        case '도서관': return '도서관';
        case '공원': return '공원';
        case '점심식사':
        case '저녁식사':
        case '브런치': return '맛집';
        case '카페': return '카페';
        case '디저트': return '디저트';
        case '술': return '술집';
        default: return t;
      }
    };

    const midKeywords = (midTags.length ? midTags : ['전시']).map(expand);
    const restaurantKeywords = restTags.length ? restTags.map(expand) : [];
    const finalKeywords = (finalTags.length ? finalTags : ['카페']).map(expand);

    // 의도 및 마무리 추정
    const what = selected.categories.size > 0 ? Array.from(selected.categories)[0] : '볼거리';
    const finish = finalTags[0] || '카페';
    const cuisine = restTags.length ? '맛집' : undefined;
    return { tags, midKeywords, restaurantKeywords, finalKeywords, what, finish, cuisine };
  };

  const [lastContext, setLastContext] = useState(null);

  const runPlan = async ({ seed = String(Date.now()) } = {}) => {
    try {
      setLoading(true);
      setProgress(0);
      setLoadingStep(0);
      const t0 = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 60);
      const t1 = setInterval(() => setLoadingStep((i) => Math.min(2, i + 1)), 1200);

      const companion = selected.with || '연인';
      const mobility = selected.mobility || '도보';
      const radius = RADIUS_BY_MOBILITY[mobility] || 1200;
      const start = await resolveStart(selected.venue || '다락소극장');
      if (!start) throw new Error('출발지를 찾을 수 없습니다.');
      const { tags, midKeywords, restaurantKeywords, finalKeywords, what, finish, cuisine } = deriveKeywords(selected);

      const [midRaw, restRaw, finalRaw] = await Promise.all([
        kakaoSearchByKeywords({ keywords: midKeywords, lat: start.lat, lng: start.lng, radius, size: 10 }),
        restaurantKeywords.length ? kakaoSearchByKeywords({ keywords: restaurantKeywords, lat: start.lat, lng: start.lng, radius, size: 10 }) : Promise.resolve([]),
        kakaoSearchByKeywords({ keywords: finalKeywords, lat: start.lat, lng: start.lng, radius, size: 10 }),
      ]);
      const mid = midRaw.map((p) => normalize(p, 'activity')); 
      const restaurants = restRaw.map((p) => normalize(p, 'restaurant'));
      const finals = finalRaw.map((p) => normalize(p, finish === '카페' ? 'cafe' : finish === '디저트' ? 'dessert' : finish === '술' ? 'bar' : 'cafe'));

      const payload = {
        companion,
        mobility,
        startName: start.name,
        startLat: start.lat,
        startLng: start.lng,
        what,
        ...(cuisine ? { cuisine } : {}),
        finish,
        tags,
        seed,
        mid,
        restaurants,
        finals,
        excludeIds: EXCLUDE_IDS.current,
      };
      const data = await aiPlan(payload);
      const plan = (data?.plans && data.plans[0]) || null;
      const steps = Array.isArray(plan?.steps) ? plan.steps : [];
      const items = steps.map((s) => ({ id: s.id, title: s.name, addr: s.address, rating: s.rating, thumb: '', role: s.role }));
      clearInterval(t0); setProgress(100); clearInterval(t1);
      setTimeout(() => { setLoading(false); setResult({ items, meta: { payload, plan, singles: data?.singles || [] } }); setLastContext({ payload });
        const allToExclude = [...steps, ...((data?.singles)||[])].map((s) => s.id || toBase64Id(s.name, s.lat, s.lng));
        EXCLUDE_IDS.current = Array.from(new Set(allToExclude));
      }, 400);
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert('코스 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

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
        <TitleCenter>
          <img src="/images/hotplroute/hotpltitle.png" alt="핫플루트" style={{ height: 28 }} />
        </TitleCenter>
        <ClipImg aria-label="to-clip" $src="/icon/goclip.png" onClick={() => { window.location.href = '/clip'; }} />
      </TopBar>

      {/* 본문: 뷰 전환 */}
      {!result && view !== 'saves' && (
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
            <RoundBtn aria-label="menu" onClick={async ()=>{ try{ const list = await getRoutes(); setSaves(list); setView('saves'); } catch(e){ setSaves([]); setView('saves'); } }}>
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
                <GhostBtn key={t} $active={selected.with === t} onClick={() => { setSelected((s)=>({ ...s, with: t })); setView('mobility'); }}>{t}</GhostBtn>
              ))}
            </ButtonsRow>
          </Main>
        </Slide>

        <Slide $active={view === 'mobility'} $dir="right">
          <Main>
            <SectionTitle>어떻게 이동하나요?</SectionTitle>
            <ButtonsRow>
              {['도보','자전거','대중교통','차'].map((m) => (
                <GhostBtn key={m} $active={selected.mobility === m} onClick={() => { setSelected((s)=>({ ...s, mobility: m })); }}>{m}</GhostBtn>
              ))}
            </ButtonsRow>
            <BottomBar>
              <PrimaryButton onClick={() => setView('category')} disabled={!selected.mobility}>다음</PrimaryButton>
            </BottomBar>
          </Main>
        </Slide>

        <Slide $active={view === 'category'} $dir="right">
          <Main style={{ paddingTop: 0 }}>
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
                  runPlan({});
                }}
              >
                코스 추천받기
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
          </Places>
          <BottomActionsRow>
            <RoundBtn aria-label="rerun" onClick={()=>{ setResult(null); runPlan({ seed: String(Date.now()) }); }}>↺</RoundBtn>
            <PrimaryButton onClick={async ()=>{
              try {
                const meta = result?.meta;
                if (!meta?.payload || !meta?.plan) throw new Error('저장할 코스가 없습니다.');
                const steps = (meta.plan.steps || []).map((s, idx) => ({
                  label: String.fromCharCode(65 + idx),
                  id: s.id,
                  role: s.role,
                  name: s.name,
                  address: s.address,
                  lat: s.lat,
                  lng: s.lng,
                  externalUrl: s.externalUrl,
                  mapLink: s.mapLink,
                  rating: s.rating,
                  ratingCount: s.ratingCount,
                }));
                const payload = {
                  title: dateText,
                  companion: meta.payload.companion,
                  mobility: meta.payload.mobility,
                  startName: meta.payload.startName,
                  startLat: meta.payload.startLat,
                  startLng: meta.payload.startLng,
                  tags: meta.payload.tags,
                  totalTravelMinutes: meta.plan.totalTravelMinutes,
                  explain: meta.plan.explain,
                  steps,
                };
                await saveRoute(payload);
                const btn = document.activeElement; if (btn) btn.textContent = '저장완료';
                setTimeout(()=>{ setResult(null); setView('start'); if (btn) btn.textContent = '저장하기'; }, 900);
              } catch (e) {
                console.error(e);
                alert('로그인이 필요하거나 저장에 실패했습니다.');
              }
            }}>저장하기</PrimaryButton>
          </BottomActionsRow>
        </ResultWrap>
      )}
      {view === 'saves' && !loading && (
        <SavesWrap>
          <SavesHeader>저장 목록</SavesHeader>
          {saves.map((s) => (
            <SaveItem key={s.id} onClick={async ()=>{ try{ const r = await getRoute(s.id); const items = (r.steps||[]).map((st)=>({ id: st.id, title: st.name, addr: st.address, rating: st.rating, thumb: '', role: st.role })); setResult({ items, meta: { fromSaved: true, savedId: r.id } }); setView(''); } catch(e){ alert('불러오기에 실패했습니다.'); } }}>
              <SaveIcon />
              <div>
                <SaveTitle>{s.title || '나의 루트'}</SaveTitle>
                <SaveDesc>{(s.tags||[]).slice(0,3).join(', ')}</SaveDesc>
              </div>
            </SaveItem>
          ))}
          {saves.length === 0 && <div style={{ color: '#888', padding: '16px 0' }}>저장된 항목이 없습니다.</div>}
        </SavesWrap>
      )}
      {loading && (
        <LoaderWrap role="dialog" aria-label="루트 생성중">
          <TopBar>
            <TitleCenter>
              <img src="/images/hotplroute/hotpltitle.png" alt="핫플루트" style={{ height: 28 }} />
            </TitleCenter>
          </TopBar>
          <LoaderIcon />
          <LoaderText>
            {['사용자를 위한 루트를 만들고 있어요','핫플루트를 생성하는 중이에요','지역 사회 활성화의 주인공이 되는 중이에요'][loadingStep]}
          </LoaderText>
        </LoaderWrap>
      )}
    </Screen>
  );
}


