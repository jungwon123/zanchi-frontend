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
  AddrPin,
  PlaceCard,
  BottomActionsRow,
  TimelineCol,
  TimelineWrap,
  TimelineLine,
  TimelineDot,
  TimelineArrow,
  SavesWrap,
  SavesHeader,
  SaveItem,
  SaveIcon,
  SaveTitle,
  SaveDesc,
} from "./_styles";
import SelectionSlides from "./_components/SelectionSlides";
import ResultView from "./_components/ResultView";
import {
  PRESET_VENUES,
  RADIUS_BY_MOBILITY,
  TAG_TO_QUERY,
  toBase64Id,
  normalize,
  parseKakaoMapLinkToCoords,
  deriveKeywords,
} from "./utils";
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
  const [view, setView] = useState("start");
  const [selected, setSelected] = useState({
    venue: null,
    with: null,
    mobility: null,
    categories: new Set(),
    sub: new Set(),
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
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
  const PROGRESS_TARGET = useRef(1);
  const PROGRESS_TIMER = useRef(null);
  const PROGRESS_CURRENT = useRef(1);

  // 부드러운 퍼센트 상승 애니메이션 (target까지 1씩 증가)
  useEffect(() => {
    if (!loading) return;
    if (PROGRESS_TIMER.current) return;
    PROGRESS_TIMER.current = setInterval(() => {
      setProgress((prev) => {
        PROGRESS_CURRENT.current = prev;
        if (prev < PROGRESS_TARGET.current) return Math.min(prev + 1, 100);
        if (PROGRESS_TARGET.current === 100 && prev < 100)
          return Math.min(prev + 1, 100);
        return prev;
      });
    }, 60);
    return () => {
      if (PROGRESS_TIMER.current) {
        clearInterval(PROGRESS_TIMER.current);
        PROGRESS_TIMER.current = null;
      }
    };
  }, [loading]);

  const setProgressTarget = (next) => {
    PROGRESS_TARGET.current = Math.max(
      PROGRESS_TARGET.current,
      Math.min(100, Math.max(1, next))
    );
  };

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

  // 상수/유틸은 utils로 분리됨

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

  // deriveKeywords 등은 utils로 분리됨

  const runPlan = async ({ seed = String(Date.now()) } = {}) => {
    try {
      setLoading(true);
      setProgress(1);
      PROGRESS_TARGET.current = 10;
      PROGRESS_CURRENT.current = 1;
      setLoadingStep(0);
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
          finish,
          cuisine,
        });
      } catch {}

      // 검색: 먹을거리 미선택 시 레스토랑 쿼리는 아예 호출 안 함
      setProgressTarget(20);
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
      setProgressTarget(45);

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
            : /* 산책 등 */ "activity"
        )
      );

      // 폴백: 먹을거리 선택한 경우에만 레스토랑 폴백
      if (restaurants.length === 0 && restaurantKeywords.length > 0) {
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
      setProgressTarget(55);

      // 파이널 폴백: finish에 맞춰 검색
      if (finals.length === 0) {
        const finFallback = await kakaoSearchByKeywords({
          keywords: [
            finish === "카페"
              ? "카페"
              : finish === "디저트"
              ? "디저트 카페 OR 베이커리"
              : finish === "산책"
              ? "공원 OR 산책로"
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
            finish === "카페"
              ? "cafe"
              : finish === "디저트"
              ? "dessert"
              : finish === "산책"
              ? "activity"
              : "bar"
          )
        );
      }
      setProgressTarget(65);

      const payload = {
        reqId,
        companion,
        mobility,
        startName: start.name,
        startLat: start.lat,
        startLng: start.lng,
        what,
        ...(cuisine ? { cuisine } : {}), // 먹을거리 고른 경우만 전송
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

      setProgressTarget(75);
      const data = await aiPlan(payload);
      setProgressTarget(85);
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
      setProgressTarget(92);

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
        mapLink: s.mapLink,
        externalUrl: s.externalUrl,
        link: s.mapLink || s.externalUrl || null,
      }));

      setProgressTarget(100);
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
        {!loading &&
          (view === "venue" ||
            view === "with" ||
            view === "mobility" ||
            view === "category" ||
            view === "saves" ||
            Boolean(result)) && (
            <BackBtn
              aria-label="back"
              onClick={() => {
                if (result) {
                  setResult(null);
                  setView("start");
                  return;
                }
                if (view === "with") {
                  setView("venue");
                  return;
                }
                if (view === "mobility") {
                  setView("with");
                  return;
                }
                if (view === "category") {
                  setView("mobility");
                  return;
                }
                if (view === "saves") {
                  setView("start");
                  return;
                }
                if (view === "venue") {
                  setView("start");
                  return;
                }
                setView("start");
              }}
            />
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
        <SelectionSlides
          view={view}
          setView={setView}
          selected={selected}
          setSelected={setSelected}
          baseCats={baseCats}
          subMap={subMap}
          runPlan={runPlan}
          getRoutes={getRoutes}
          setSaves={setSaves}
        />
      )}

      {result && !loading && (
        <ResultView
          result={result}
          dateText={dateText}
          setDateText={setDateText}
          onSave={async () => {
            try {
              if (saving) return;
              setSaving(true);
              const meta = result && result.meta;
              if (!meta || !meta.payload || !meta.plan)
                throw new Error("저장할 코스가 없습니다.");
              const srcSteps = meta.planEnrichedSteps || meta.plan.steps || [];
              const steps = srcSteps.map((s, idx) => ({
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
          onRerun={() => {
            setResult(null);
            runPlan({ seed: String(Date.now()) });
          }}
        />
      )}

      {view === "saves" && !loading && (
        <SavesList
          saves={saves}
          getRoute={getRoute}
          setResult={setResult}
          setView={setView}
        />
      )}

      {loading && (
        <LoaderWrap role="dialog" aria-label="루트 생성중">
          <TopBar>
            <TitleCenter>
              <img
                src="/images/hotplroute/hotpltitle.png"
                alt="핫플루트"
                style={{ height: 36 }}
              />
            </TitleCenter>
          </TopBar>
          <div style={{ display: "grid", placeItems: "center", gap: 12 }}>
            <div
              aria-label="percent"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#040404",
                marginTop: 4,
              }}
            >
              {progress}%
            </div>
            <LoaderIcon style={{ transform: "scale(1.25)" }} />
          </div>
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
