import api from "../_lib/axios";

// Kakao 장소 검색 프록시
export async function kakaoSearch(params = {}) {
  const { data } = await api.get("/places/kakao", { params });
  return Array.isArray(data) ? data : [];
}

// 여러 키워드로 병렬 검색 후 합치기
export async function kakaoSearchByKeywords({
  keywords = [],
  lat,
  lng,
  radius,
  size = 10,
}) {
  const unique = new Map();
  const searches = keywords
    .filter(Boolean)
    .map((query) => kakaoSearch({ query, lat, lng, radius, size }));
  const results = await Promise.allSettled(searches);
  results.forEach((r) => {
    if (r.status === "fulfilled") {
      r.value.forEach((p) => {
        const key = `${p.name}|${p.lat}|${p.lng}`;
        if (!unique.has(key)) unique.set(key, p);
      });
    }
  });
  return Array.from(unique.values());
}

// 코스 추천 생성
export async function aiPlan(payload) {
  const { data } = await api.post("/ai/plan", payload);
  return data;
}

// 코스 저장
export async function saveRoute(payload) {
  const { data } = await api.post("/api/me/routes", payload);
  return data;
}

// 저장한 코스 목록
export async function getRoutes() {
  const { data } = await api.get("/api/me/routes");
  const list = Array.isArray(data) ? data : [];
  // tags 필드 정규화: 문자열/undefined → 문자열 배열
  return list.map((r) => ({
    ...r,
    tags: Array.isArray(r?.tags)
      ? r.tags
      : typeof r?.tags === "string"
      ? r.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  }));
}

// 저장한 코스 단건
export async function getRoute(id) {
  const { data } = await api.get(`/api/me/routes/${encodeURIComponent(id)}`);
  return data;
}
