"use client";

import { useQuery } from "@tanstack/react-query";
import FeedItem from "./FeedItem";
import { getClips } from "@/app/_api/clips";

export default function FeedList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clips-all", 0],
    queryFn: () => getClips({ page: 0, size: 10 }),
    staleTime: 60_000,
  });
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
        const dx = (e.currentTarget?._sx ?? 0) - (e.changedTouches[0]?.clientX ?? 0);
        const dy = Math.abs((e.currentTarget?._sy ?? 0) - (e.changedTouches[0]?.clientY ?? 0));
        if (dx > 60 && dy < 40) { window.location.href = '/hotplroute'; }
      }}
    >
      {data.items.map((item, idx) => (
        <div key={item.id ?? idx} style={{ scrollSnapAlign: "start" }}>
          <FeedItem index={idx} src={item.src} clipId={item.id} authorName={item.authorName} caption={item.caption} uploaderId={item.uploaderId} uploaderAvatarUrl={item.uploaderAvatarUrl} likes={item.likeCount} comments={item.commentCount} liked={item.liked} savedInitial={item.saved} />
        </div>
      ))}
    </div>
  );
}


