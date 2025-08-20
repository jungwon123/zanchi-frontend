"use client";

import api from "@/app/_lib/axios";

export async function searchMembers({ q, page = 0, size = 20 }) {
  const { data } = await api.get('/api/members/search', { params: { q, page, size } });
  return data;
}

export async function searchClips({ q, page = 0, size = 20, sort }) {
  const params = { q, page, size };
  if (sort) params.sort = sort;
  const { data } = await api.get('/api/clips/search', { params });
  return data;
}


