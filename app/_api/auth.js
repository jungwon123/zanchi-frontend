"use client";

import api from "@/app/_lib/axios";
import { getMySummary } from "@/app/_api/profile";

export async function signup({ loginId, name, password }) {
  const { data } = await api.post('/api/signup', { loginId, name, password });
  return data; // { id, loginId, name, createdAt }
}

export async function login({ loginId, password }) {
  const { data } = await api.post('/api/login', { loginId, password });
  if (typeof window !== 'undefined') {
    if (data && data.token) {
      localStorage.setItem('auth_token', data.token);
    } else {
      localStorage.removeItem('auth_token');
    }
    try {
      // 백엔드가 member를 안 주는 경우 대비: 토큰 저장 후 내 정보 조회하여 저장
      const me = await getMySummary();
      localStorage.setItem('auth_member', JSON.stringify(me || {}));
    } catch {
      localStorage.setItem('auth_member', JSON.stringify(data?.member || {}));
    }
  }
  return data;
}

export async function logout() {
  const { data } = await api.post('/api/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_member');
  }
  return data;
}


