"use client";

// 상수들
export const PRESET_VENUES = {
  다락소극장: { name: "떼아뜨르다락소극장", lat: 37.473108, lng: 126.625204 },
  신포아트홀: { name: "신포 아트홀", lat: 37.47344, lng: 126.62465 },
};

export const RADIUS_BY_MOBILITY = {
  도보: 1200,
  자전거: 2500,
  대중교통: 4000,
  차: 6000,
};

export const TAG_TO_QUERY = {
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

// 유틸들
export const toBase64Id = (name, lat, lng) => {
  try {
    const raw = `${name}|${(+lat).toFixed(6)}|${(+lng).toFixed(6)}`;
    const b = btoa(unescape(encodeURIComponent(raw)));
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return `${name}|${lat}|${lng}`;
  }
};

export const normalize = (p, role) => ({
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

export const parseKakaoMapLinkToCoords = (link) => {
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

export const deriveKeywords = (sel) => {
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
  const finalTags = tags.filter((t) => ["커피", "디저트", "술"].includes(t));

  const expand = (t) =>
    Object.prototype.hasOwnProperty.call(TAG_TO_QUERY, t) ? TAG_TO_QUERY[t] : t;

  const preferWalkBase =
    sel.categories.has("쉴거리") ||
    tags.includes("자연") ||
    tags.includes("산책로");
  const midDefault = preferWalkBase ? ["산책로", "자연"] : ["전시"];
  const midKeywords = (midTags.length ? midTags : midDefault)
    .map(expand)
    .filter(Boolean);

  const restaurantKeywords = (
    restTags.length ? restTags.map(expand) : []
  ).filter(Boolean);

  let finish = finalTags[0] || (preferWalkBase ? "산책" : "카페");
  const finalDefault = finish === "산책" ? ["산책로"] : ["카페"];
  const finalKeywords = (finalTags.length ? finalTags : finalDefault)
    .map(expand)
    .filter(Boolean);

  const cuisine = restTags.length ? "맛집" : undefined;
  const what =
    sel.categories.size > 0
      ? Array.from(sel.categories)[0]
      : preferWalkBase
      ? "쉴거리"
      : "볼거리";

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
