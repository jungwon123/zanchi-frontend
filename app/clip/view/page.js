"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMemberClipsList } from "@/app/_api/profile";
import FeedItem from "../_components/FeedItem";

export default function ClipViewerPage() {
  return (
    <React.Suspense fallback={<div style={{ color: "#999", padding: 16 }}>로딩중…</div>}>
      <ClipViewerInner />
    </React.Suspense>
  );
}

function ClipViewerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const userId = Number(params.get("userId")) || 0;
  const startIndexParam = Number(params.get("index")) || 0;
  const startClipId = Number(params.get("clipId")) || null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["member-clips-view", userId, 0],
    queryFn: () => getMemberClipsList(userId, { page: 0, size: 50 }),
    enabled: userId > 0,
    staleTime: 60_000,
  });

  const items = data?.items || [];
  const initialIndex = (() => {
    if (startClipId) {
      const fi = items.findIndex((it) => Number(it.id) === Number(startClipId));
      if (fi >= 0) return fi;
    }
    return Math.min(Math.max(0, startIndexParam), Math.max(0, items.length - 1));
  })();
  const [idx, setIdx] = useState(initialIndex);

  // 데이터가 로드된 뒤 쿼리 clipId(또는 index)에 맞춰 시작 위치 보정
  useEffect(() => {
    if (!items.length) return;
    if (startClipId) {
      const fi = items.findIndex((it) => Number(it.id) === Number(startClipId));
      if (fi >= 0) { setIdx(fi); return; }
    }
    if (!Number.isNaN(startIndexParam)) {
      const i = Math.min(Math.max(0, startIndexParam), Math.max(0, items.length - 1));
      setIdx(i);
    }
  }, [items, startClipId, startIndexParam]);

  const current = items[idx];

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(items.length - 1, i + 1));

  if (isLoading) return <div style={{ color: "#999", padding: 16 }}>로딩중…</div>;
  if (isError || !current) return <div style={{ color: "#f66", padding: 16 }}>클립을 불러오지 못했습니다.</div>;

  return (
    <div style={{ height: "100svh", background: "#000", position: "relative" }}>
      <FeedItem
        index={idx}
        src={current.src}
        clipId={current.id}
        authorName={current.authorName}
        caption={current.caption}
        uploaderId={current.uploaderId}
        likes={current.likeCount}
        comments={current.commentCount}
        liked={current.liked}
        savedInitial={current.saved}
      />

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 12, display: "flex", justifyContent: "space-between", padding: "0 12px", pointerEvents: "none" }}>
        <button onClick={goPrev} disabled={idx <= 0} style={{ pointerEvents: "auto", opacity: idx <= 0 ? .4 : 1, background: "rgba(255,255,255,.12)", color: "#fff", border: 0, borderRadius: 12, padding: "8px 12px" }}>이전</button>
        <button onClick={() => router.back()} style={{ pointerEvents: "auto", background: "rgba(255,255,255,.12)", color: "#fff", border: 0, borderRadius: 12, padding: "8px 12px" }}>닫기</button>
        <button onClick={goNext} disabled={idx >= items.length - 1} style={{ pointerEvents: "auto", opacity: idx >= items.length - 1 ? .4 : 1, background: "rgba(255,255,255,.12)", color: "#fff", border: 0, borderRadius: 12, padding: "8px 12px" }}>다음</button>
      </div>
    </div>
  );
}


