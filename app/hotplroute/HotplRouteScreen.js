"use client";

import { useState, useRef, useEffect } from "react";
import {
  Screen,
  TopBar,
  BackBtn,
  ClipImg,
  TitleCenter,
  Main,
  IntroText,
  Illustration,
  BottomActions,
  RoundBtn,
  CtaBtn,
  Slides,
  Slide,
  SectionTitle,
  TwoCols,
  GhostBtn,
  ButtonsRow,
  FourGrid,
  BottomBar,
  LoaderWrap,
  LoaderLogo,
  LoaderIcon,
  LoaderText,
  ResultWrap,
  ResultTop,
  DateText,
  EditBtn,
  Places,
  PlaceItem,
  Thumb,
  PlaceTitle,
  RatingRow,
  Star,
  AddrRow,
  MarkerBadge,
  BottomActionsRow,
  SavesWrap,
  SavesHeader,
  SaveItem,
  SaveIcon,
  SaveTitle,
  SaveDesc,
} from "./_styles";
import PrimaryButton from "../_components/PrimaryButton";
import {
  kakaoSearch,
  kakaoSearchByKeywords,
  aiPlan,
  saveRoute,
  getRoutes,
  getRoute,
} from "../_api/hotplroute";

export default function HotplRouteScreen() {
  const [view, setView] = useState("start"); // 'start' | 'venue' | 'with' | 'mobility' | 'category' | 'saves'
  const [selected, setSelected] = useState({
    venue: null,
    with: null,
    mobility: null,
    categories: new Set(),
    sub: new Set(),
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0~100
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null); // 로딩 완료 후 결과 존재
  const [saves, setSaves] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hotpl_saves") || "[]");
    } catch {
      return [];
    }
  });
  const [dateText, setDateText] = useState("2025.08.25");
  const [saving, setSaving] = useState(false);

  const EXCLUDE_IDS = useRef([]);
  const LAST_RENDER = useRef(null);
  const [lastContext, setLastContext] = useState(null);

  // excludeIds 세션 유지/복구
  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("hotpl_exclude_ids") || "[]"
      );
      if (Array.isArray(saved)) EXCLUDE_IDS.current = saved;
    } catch {}
  }, []);
  const updateExcludeIds = (ids) => {
    const arr = Array.from(new Set(ids.filter(Boolean)));
    EXCLUDE_IDS.current = arr;
    try {
      sessionStorage.setItem("hotpl_exclude_ids", JSON.stringify(arr));
    } catch {}
  };

  // Preset venues (좌표)
  const PRESET_VENUES = {
    다락소극장: { name: "떼아뜨르다락소극장", lat: 37.473108, lng: 126.625204 },
    신포아트홀: { name: "신포 아트홀", lat: 37.47344, lng: 126.62465 },
  };

  const RADIUS_BY_MOBILITY = {
    도보: 1200,
    자전거: 2500,
    대중교통: 4000,
    차: 6000,
  };

  // URL-safe Base64 (백엔드가 Base64.getUrlDecoder() 쓰므로 맞춰줌)
  const toBase64Id = (name, lat, lng) => {
    try {
      const raw = `${name}|${(+lat).toFixed(6)}|${(+lng).toFixed(6)}`;
      const b = btoa(unescape(encodeURIComponent(raw)));
      return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    } catch {
      return `${name}|${lat}|${lng}`;
    }
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

  // 검색 키워드 매핑(확장)
  const TAG_TO_QUERY = {
    지역문화: "문화거리 OR 전통문화 OR 거리공연 OR 역사",
    전시: "전시 OR 미술관 OR 박물관",
    시장: "전통시장 OR 재래시장",
    자연: "자연경관 OR 생태공원",
    명소: "관광명소 OR 포토스팟 OR 전망대",
    축제: "축제",
    산책로: "산책로 OR 공원",
    점심식사: "맛집 OR 식당",
    저녁식사: "맛집 OR 식당",
    브런치: "브런치 카페",
    커피: "카페",
    디저트: "디저트 카페 OR 베이커리",
    술: "와인바 OR 칵테일바 OR 포차",
    공방: "원데이 클래스 OR 체험 공방",
    도서관: "도서관 OR 북카페",
    볼거리: null,
    놀거리: null,
    쉼자리: null,
    먹을거리: null,
  };

  const deriveKeywords = (sel) => {
    const tags = Array.from(sel.sub).map((s) => s.split("|")[1]);
    const midTags = tags.filter((t) =>
      [
        "전시",
        "자연",
        "시장",
        "지역문화",
        "공방",
        "도서관",
        "공원",
        "명소",
        "축제",
        "산책로",
      ].includes(t)
    );
    const restTags = tags.filter((t) =>
      ["점심식사", "저녁식사", "브런치"].includes(t)
    );
    const finalTags = tags.filter((t) => ["카페", "디저트", "술"].includes(t));

    const expand = (t) =>
      Object.prototype.hasOwnProperty.call(TAG_TO_QUERY, t)
        ? TAG_TO_QUERY[t]
        : t;

    const midKeywords = (midTags.length ? midTags : ["전시"])
      .map(expand)
      .filter(Boolean);
    const restaurantKeywords = (
      restTags.length ? restTags.map(expand) : []
    ).filter(Boolean);
    const finalKeywords = (finalTags.length ? finalTags : ["카페"])
      .map(expand)
      .filter(Boolean);

    const what =
      sel.categories.size > 0 ? Array.from(sel.categories)[0] : "볼거리";
    const finish = finalTags[0] || "카페";
    const cuisine = restTags.length ? "맛집" : undefined;

    return {
      tags,
      midKeywords,
      restaurantKeywords,
      finalKeywords,
      what,
      finish,
      cuisine,
    };
  };

  const runPlan = async ({ seed = String(Date.now()) } = {}) => {
    try {
      setLoading(true);
      setProgress(0);
      setLoadingStep(0);
      const t0 = setInterval(
        () => setProgress((p) => Math.min(100, p + 2)),
        60
      );
      const t1 = setInterval(
        () => setLoadingStep((i) => Math.min(2, i + 1)),
        1200
      );

      const companion = selected.with || "연인";
      const mobility = selected.mobility || "도보";
      const radius = RADIUS_BY_MOBILITY[mobility] || 1200;
      const start = await resolveStart(selected.venue || "다락소극장");
      if (!start) throw new Error("출발지를 찾을 수 없습니다.");

      const {
        tags,
        midKeywords,
        restaurantKeywords,
        finalKeywords,
        what,
        finish,
        cuisine,
      } = deriveKeywords(selected);

      const reqId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      try {
        console.log("[HotplRoute] reqId", reqId, "searchInput:", {
          start,
          radius,
          companion,
          mobility,
          midKeywords,
          restaurantKeywords,
          finalKeywords,
        });
      } catch {}

      const [midRaw, restRaw, finalRaw] = await Promise.all([
        kakaoSearchByKeywords({
          keywords: midKeywords,
          lat: start.lat,
          lng: start.lng,
          radius,
          size: 10,
        }),
        restaurantKeywords.length
          ? kakaoSearchByKeywords({
              keywords: restaurantKeywords,
              lat: start.lat,
              lng: start.lng,
              radius,
              size: 10,
            })
          : Promise.resolve([]),
        kakaoSearchByKeywords({
          keywords: finalKeywords,
          lat: start.lat,
          lng: start.lng,
          radius,
          size: 10,
        }),
      ]);

      let mid = (midRaw || []).map((p) => normalize(p, "activity"));
      let restaurants = (restRaw || []).map((p) => normalize(p, "restaurant"));
      let finals = (finalRaw || []).map((p) =>
        normalize(
          p,
          finish === "카페"
            ? "cafe"
            : finish === "디저트"
            ? "dessert"
            : finish === "술"
            ? "bar"
            : "cafe"
        )
      );

      // 폴백 검색(빈 후보 방지)
      if (restaurants.length === 0) {
        const restFallback = await kakaoSearchByKeywords({
          keywords: ["맛집 OR 식당"],
          lat: start.lat,
          lng: start.lng,
          radius,
          size: 6,
        });
        restaurants = (restFallback || []).map((p) =>
          normalize(p, "restaurant")
        );
      }
      if (finals.length === 0) {
        const finFallback = await kakaoSearchByKeywords({
          keywords: [
            finish === "카페"
              ? "카페"
              : finish === "디저트"
              ? "디저트 카페 OR 베이커리"
              : "와인바 OR 칵테일바 OR 포차",
          ],
          lat: start.lat,
          lng: start.lng,
          radius,
          size: 6,
        });
        finals = (finFallback || []).map((p) =>
          normalize(
            p,
            finish === "카페" ? "cafe" : finish === "디저트" ? "dessert" : "bar"
          )
        );
      }

      const payload = {
        reqId,
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
      try {
        console.log("[HotplRoute] reqId", reqId, "plannerPayload:", payload);
      } catch {}

      const data = await aiPlan(payload);
      const plan = (data && data.plans && data.plans[0]) || null;
      const steps = Array.isArray(plan && plan.steps) ? plan.steps : [];

      try {
        console.log("[HotplRoute] reqId", reqId, "aiPlan result:", {
          plansCount: data && data.plans ? data.plans.length : 0,
          stepsCount: steps.length,
          singlesCount: data && data.singles ? data.singles.length : 0,
        });
      } catch {}

      // 좌표/이름 보강
      const normalizeName = (s) => (s || "").replace(/\s+/g, "").toLowerCase();
      const parseKakaoMapLinkToCoords = (link) => {
        try {
          if (!link) return null;
          const dec = decodeURIComponent(link);
          const parts = dec.split(",");
          const lat = parseFloat(parts[parts.length - 2]);
          const lng = parseFloat(parts[parts.length - 1]);
          if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
          return null;
        } catch {
          return null;
        }
      };
      const allCandidates = [...mid, ...restaurants, ...finals];
      const nameToCandidate = new Map();
      allCandidates.forEach((c) =>
        nameToCandidate.set(normalizeName(c.name), c)
      );

      const enrichFromCandidates = (s) => {
        const baseName = s.name || s.id;
        const coordsFromLink = parseKakaoMapLinkToCoords(s.mapLink);
        const cand = nameToCandidate.get(normalizeName(baseName));
        const lat =
          s.lat && s.lat !== 0
            ? s.lat
            : (coordsFromLink && coordsFromLink.lat) ?? (cand && cand.lat);
        const lng =
          s.lng && s.lng !== 0
            ? s.lng
            : (coordsFromLink && coordsFromLink.lng) ?? (cand && cand.lng);
        const address = s.address || (cand && cand.address);
        const externalUrl = s.externalUrl || (cand && cand.externalUrl);
        const rating = s.rating ?? (cand && cand.rating);
        const ratingCount = s.ratingCount ?? (cand && cand.ratingCount);
        const role = s.role || (cand && cand.role);
        const derivedId = toBase64Id(baseName || "unknown", lat || 0, lng || 0);
        return {
          id: derivedId,
          rawId: s.id,
          role,
          name: baseName,
          address,
          lat: lat || 0,
          lng: lng || 0,
          externalUrl,
          mapLink: s.mapLink,
          rating,
          ratingCount,
        };
      };

      const enrichedSteps = steps.map(enrichFromCandidates);
      const enrichedSingles = Array.isArray(data && data.singles)
        ? data.singles.map(enrichFromCandidates)
        : [];

      // steps가 4 미만이면 singles로 보충 + 정렬
      const roleOrder = {
        activity: 1,
        restaurant: 2,
        cafe: 3,
        dessert: 3,
        bar: 3,
      };
      let stepsForDisplay = enrichedSteps
        .filter((s) => s.role !== "start")
        .sort((a, b) => (roleOrder[a.role] || 9) - (roleOrder[b.role] || 9));

      const seenIds = new Set(stepsForDisplay.map((s) => s.id));
      for (const s of enrichedSingles) {
        if (stepsForDisplay.length >= 4) break;
        if (!seenIds.has(s.id)) {
          stepsForDisplay.push(s);
          seenIds.add(s.id);
        }
      }
      stepsForDisplay = stepsForDisplay.slice(0, 4);

      const items = stepsForDisplay.map((s) => ({
        id: s.id,
        title: s.name,
        addr: s.address,
        rating: s.rating,
        thumb: "",
        role: s.role,
      }));

      clearInterval(t0);
      setProgress(100);
      clearInterval(t1);
      setTimeout(() => {
        setLoading(false);
        setResult({
          items,
          meta: {
            payload,
            plan,
            singles: data && data.singles ? data.singles : [],
            planEnrichedSteps: enrichedSteps,
            singlesEnriched: enrichedSingles,
          },
        });
        setLastContext({ payload });

        const allToExclude = Array.from(
          new Set([
            ...steps.map((s) => s.id).filter(Boolean),
            ...enrichedSteps.map((s) => s.id).filter(Boolean),
            ...((data && data.singles) || []).map((s) => s.id).filter(Boolean),
            ...enrichedSingles.map((s) => s.id).filter(Boolean),
          ])
        );
        updateExcludeIds(allToExclude);
      }, 400);
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("코스 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const baseCats = ["볼거리", "놀거리", "쉴거리", "먹을거리"];
  const subMap = {
    볼거리: ["전시", "자연", "시장", "지역문화"],
    놀거리: ["지역문화", "공방"],
    쉴거리: ["공원", "도서관", "카페"],
    먹을거리: ["점심식사", "저녁식사", "브런치", "커피", "디저트", "술"],
  };

  const toggleCategory = (cat) => {
    setSelected((s) => {
      const next = new Set(s.categories);
      if (next.has(cat)) {
        next.delete(cat);
        const nextSub = new Set(
          [...s.sub].filter((x) => !x.startsWith(cat + "|"))
        );
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
      if (next.has(key)) next.delete(key);
      else if (next.size < 4) next.add(key);
      return { ...s, sub: next };
    });
  };

  const mockPlaces = [
    {
      id: "p1",
      title: "신포국제시장",
      thumb: "https://picsum.photos/seed/101/240/240",
      rating: 4.43,
      addr: "인천 중구 신포동 6-6",
    },
    {
      id: "p2",
      title: "신포공갈빵",
      thumb: "https://picsum.photos/seed/102/240/240",
      rating: 4.36,
      addr: "인천 중구 우현로49번길 14",
    },
    {
      id: "p3",
      title: "카페맑음",
      thumb: "https://picsum.photos/seed/103/240/240",
      rating: 4.68,
      addr: "인천 중구 신포로 32-21",
    },
    {
      id: "p4",
      title: "뜬돌집",
      thumb: "https://picsum.photos/seed/104/240/240",
      rating: 4.89,
      addr: "인천 중구 우현로45번길 30-11층",
    },
  ];

  return (
    <Screen>
      <TopBar>
        {view === "venue" && (
          <BackBtn aria-label="back" onClick={() => setView("start")}>
            ‹
          </BackBtn>
        )}
        <TitleCenter>
          <img
            src="/images/hotplroute/hotpltitle.png"
            alt="핫플루트"
            style={{ height: 28 }}
          />
        </TitleCenter>
        <ClipImg
          aria-label="to-clip"
          $src="/icon/goclip.png"
          onClick={() => {
            window.location.href = "/clip";
          }}
        />
      </TopBar>

      {/* 본문: 뷰 전환 */}
      {!result && view !== "saves" && (
        <Slides>
          <Slide $active={view === "start"} $dir="right">
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
              <RoundBtn
                aria-label="menu"
                onClick={async () => {
                  try {
                    const list = await getRoutes();
                    setSaves(list);
                    setView("saves");
                  } catch (e) {
                    setSaves([]);
                    setView("saves");
                  }
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    borderTop: "3px solid #fff",
                    borderBottom: "3px solid #fff",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 8,
                      borderTop: "3px solid #fff",
                    }}
                  />
                </span>
              </RoundBtn>
              <CtaBtn onClick={() => setView("venue")}>루트 만들기</CtaBtn>
            </BottomActions>
          </Slide>

          <Slide $active={view === "venue"} $dir="right">
            <Main>
              <SectionTitle>잔치가 어디에서 열리나요?</SectionTitle>
              <TwoCols>
                {["다락소극장", "신포아트홀"].map((t) => (
                  <GhostBtn
                    key={t}
                    $active={selected.venue === t}
                    onClick={() => {
                      setSelected((s) => ({ ...s, venue: t }));
                      setView("with");
                    }}
                  >
                    {t}
                  </GhostBtn>
                ))}
              </TwoCols>
            </Main>
          </Slide>

          <Slide $active={view === "with"} $dir="right">
            <Main>
              <SectionTitle>누구랑 잔치를 보러왔나요?</SectionTitle>
              <ButtonsRow>
                {["가족", "친구", "연인", "혼자"].map((t) => (
                  <GhostBtn
                    key={t}
                    $active={selected.with === t}
                    onClick={() => {
                      setSelected((s) => ({ ...s, with: t }));
                      setView("mobility");
                    }}
                  >
                    {t}
                  </GhostBtn>
                ))}
              </ButtonsRow>
            </Main>
          </Slide>

          <Slide $active={view === "mobility"} $dir="right">
            <Main>
              <SectionTitle>어떻게 이동하나요?</SectionTitle>
              <ButtonsRow>
                {["도보", "자전거", "대중교통", "차"].map((m) => (
                  <GhostBtn
                    key={m}
                    $active={selected.mobility === m}
                    onClick={() => {
                      setSelected((s) => ({ ...s, mobility: m }));
                      setView("category");
                    }}
                  >
                    {m}
                  </GhostBtn>
                ))}
              </ButtonsRow>
              <BottomBar>
                <PrimaryButton
                  onClick={() => setView("category")}
                  disabled={!selected.mobility}
                >
                  다음
                </PrimaryButton>
              </BottomBar>
            </Main>
          </Slide>

          <Slide $active={view === "category"} $dir="right">
            <Main style={{ paddingTop: 0 }}>
              <SectionTitle>어디를 가고싶나요?</SectionTitle>
              <FourGrid>
                {baseCats.map((t) => (
                  <GhostBtn
                    key={t}
                    $mid={selected.categories.has(t)}
                    $active={false}
                    onClick={() => toggleCategory(t)}
                  >
                    {t}
                  </GhostBtn>
                ))}
              </FourGrid>

              {baseCats
                .filter((c) => selected.categories.has(c))
                .map((c) => (
                  <div key={c} style={{ marginTop: 16 }}>
                    <SectionTitle
                      style={{ fontSize: 18, margin: "24px 0 12px" }}
                    >
                      {c}
                    </SectionTitle>
                    <ButtonsRow>
                      {(subMap[c] || []).map((s) => (
                        <GhostBtn
                          key={c + ":" + s}
                          $active={selected.sub.has(`${c}|${s}`)}
                          onClick={() => toggleSub(c, s)}
                        >
                          {s}
                        </GhostBtn>
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
            <DateText
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
            />
            <EditBtn
              onClick={() => {
                const v = prompt("날짜를 입력하세요 (YYYY.MM.DD)", dateText);
                if (v) setDateText(v);
              }}
            />
          </ResultTop>
          <Places>
            {result.items.map((p, i) => (
              <PlaceItem key={p.id}>
                <Thumb style={{ backgroundImage: `url(${p.thumb})` }} />
                <div>
                  <PlaceTitle>{p.title}</PlaceTitle>
                  <RatingRow>
                    <Star>★</Star>
                    <div>
                      {p.rating != null ? Number(p.rating).toFixed(2) : ""}
                    </div>
                  </RatingRow>
                  <AddrRow>
                    <MarkerBadge>{String.fromCharCode(65 + i)}</MarkerBadge>
                    <div>{p.addr}</div>
                  </AddrRow>
                </div>
              </PlaceItem>
            ))}
          </Places>
          <BottomActionsRow>
            <RoundBtn
              aria-label="rerun"
              onClick={() => {
                setResult(null);
                runPlan({ seed: String(Date.now()) });
              }}
            >
              ↺
            </RoundBtn>
            <PrimaryButton
              onClick={async () => {
                try {
                  if (saving) return;
                  setSaving(true);

                  const meta = result && result.meta;
                  if (!meta || !meta.payload || !meta.plan)
                    throw new Error("저장할 코스가 없습니다.");

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

                  const btn = document.activeElement;
                  if (btn) btn.textContent = "저장완료";
                  setTimeout(() => {
                    setResult(null);
                    setView("start");
                    if (btn) btn.textContent = "저장하기";
                  }, 900);
                } catch (e) {
                  console.error(e);
                  alert("로그인이 필요하거나 저장에 실패했습니다.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              저장하기
            </PrimaryButton>
          </BottomActionsRow>
        </ResultWrap>
      )}

      {view === "saves" && !loading && (
        <SavesWrap>
          <SavesHeader>저장 목록</SavesHeader>
          {saves.map((s) => (
            <SaveItem
              key={s.id}
              onClick={async () => {
                try {
                  const r = await getRoute(s.id);
                  const items = (r.steps || []).map((st) => ({
                    id: st.id,
                    title: st.name,
                    addr: st.address,
                    rating: st.rating,
                    thumb: "",
                    role: st.role,
                  }));
                  setResult({
                    items,
                    meta: { fromSaved: true, savedId: r.id },
                  });
                  setView("");
                } catch (e) {
                  alert("불러오기에 실패했습니다.");
                }
              }}
            >
              <SaveIcon />
              <div>
                <SaveTitle>{s.title || "나의 루트"}</SaveTitle>
                <SaveDesc>{(s.tags || []).slice(0, 3).join(", ")}</SaveDesc>
              </div>
            </SaveItem>
          ))}
          {saves.length === 0 && (
            <div style={{ color: "#888", padding: "16px 0" }}>
              저장된 항목이 없습니다.
            </div>
          )}
        </SavesWrap>
      )}

      {loading && (
        <LoaderWrap role="dialog" aria-label="루트 생성중">
          <TopBar>
            <TitleCenter>
              <img
                src="/images/hotplroute/hotpltitle.png"
                alt="핫플루트"
                style={{ height: 28 }}
              />
            </TitleCenter>
          </TopBar>
          <LoaderIcon />
          <LoaderText>
            {
              [
                "사용자를 위한 루트를 만들고 있어요",
                "핫플루트를 생성하는 중이에요",
                "지역 사회 활성화의 주인공이 되는 중이에요",
              ][loadingStep]
            }
          </LoaderText>
        </LoaderWrap>
      )}
    </Screen>
  );
}
