"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import FeedItem from "./FeedItem";
import { getClips, getFollowingClips } from "@/app/_api/clips";
import { useRecoilValue } from "recoil";
import { activeTabState } from "@/app/_state/atoms";

export default function FeedList() {
  const tab = useRecoilValue(activeTabState);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [tab === "following" ? "clips-following" : "clips-all"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      tab === "following"
        ? getFollowingClips({ page: pageParam, size: 3 })
        : getClips({ page: pageParam, size: 3 }),
    getNextPageParam: (lastPage, pages) => {
      const pageSize = lastPage?.pageable?.pageSize ?? 3;
      const count = Array.isArray(lastPage?.items) ? lastPage.items.length : 0;
      return count < pageSize ? undefined : pages.length;
    },
    staleTime: 60_000,
  });

  const items = useMemo(
    () => (data?.pages || []).flatMap((p) => p.items || []),
    [data?.pages]
  );

  const loadMoreRef = useRef(null);
  const nearEndRef = useRef(null);
  useEffect(() => {
    const targets = [loadMoreRef.current, nearEndRef.current].filter(Boolean);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            break;
          }
        }
      },
      { root: null, rootMargin: "600px 0px", threshold: 0.1 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items.length]);

  if (isLoading) return <div style={{ color: "#999" }}>로딩중…</div>;
  if (isError) return <div style={{ color: "#f66" }}>에러가 발생했습니다.</div>;

  return (
    <div
      style={{ scrollSnapType: "y mandatory" }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        e.currentTarget._sx = t.clientX;
        e.currentTarget._sy = t.clientY;
      }}
      onTouchEnd={(e) => {
        const dx =
          (e.currentTarget?._sx ?? 0) - (e.changedTouches[0]?.clientX ?? 0);
        const dy = Math.abs(
          (e.currentTarget?._sy ?? 0) - (e.changedTouches[0]?.clientY ?? 0)
        );
        if (dx > 60 && dy < 40) {
          window.location.href = "/hotplroute";
        }
      }}
    >
      {items.map((item, idx) => {
        const isNearEnd = idx === Math.max(0, items.length - 3);
        return (
          <div
            key={`${item.id ?? idx}-${idx}`}
            style={{ scrollSnapAlign: "start" }}
          >
            <FeedItem
              index={idx}
              src={item.src}
              clipId={item.id}
              authorName={item.authorName}
              caption={item.caption}
              uploaderId={item.uploaderId}
              uploaderAvatarUrl={item.uploaderAvatarUrl}
              likes={item.likeCount}
              comments={item.commentCount}
              liked={item.liked}
              savedInitial={item.saved}
            />
            {isNearEnd && <div ref={nearEndRef} style={{ height: 1 }} />}
          </div>
        );
      })}
      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
