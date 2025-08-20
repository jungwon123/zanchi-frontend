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
    <div style={{ scrollSnapType: "y mandatory" }}>
      {data.items.map((item, idx) => (
        <div key={item.id ?? idx} style={{ scrollSnapAlign: "start" }}>
          <FeedItem index={idx} src={item.src} clipId={item.id} />
        </div>
      ))}
    </div>
  );
}


