"use client";

import api from "@/app/_lib/axios";

// 알림 목록 조회 (호출 시 읽음 처리 서버 기준)
export async function getNotifications({ page = 0, size = 20 } = {}) {
  const { data } = await api.get('/api/notifications', { params: { page, size } });
  // 서버 예시가 단건으로 되어 있어도 배열 또는 페이지 결과를 모두 포용
  const items = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : (data ? [data] : []);
  return { items, raw: data };
}


