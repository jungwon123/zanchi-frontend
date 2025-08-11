export async function GET() {
  // 데모용 정적 피드. 실제로는 외부 API에서 받아오거나 DB 조회
  const items = [
    { id: "1", hls: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { id: "2", hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" },
    { id: "3", hls: "https://moq.cloud.ibm.com/hls/hls.m3u8" },
  ];
  return Response.json({ items });
}


