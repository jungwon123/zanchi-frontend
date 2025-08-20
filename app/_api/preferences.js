"use client";

import api from "@/app/_lib/axios";

export async function submitSurvey(tagIds) {
  const { data } = await api.post('/api/preferences/survey', { tagIds });
  return data; // { memberId, selectedTags, completed }
}


