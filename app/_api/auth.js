"use client";

import api from "@/app/_lib/axios";
import { getMySummary } from "@/app/_api/profile";

export async function signup({ loginId, name, password }) {
  const { data } = await api.post('/api/signup', { loginId, name, password });
  return data; // { id, loginId, name, createdAt }
}

export async function login({ loginId, password }) {
  const res = await api.post('/api/login', { loginId, password });
  const { data, headers } = res;
  if (typeof window !== 'undefined') {
    // 우선순위: 응답 헤더 Authorization > 바디 token
    const headerAuth = headers?.authorization || headers?.Authorization;
    let token = '';
    if (headerAuth && typeof headerAuth === 'string') {
      token = headerAuth.replace(/^Bearer\s+/i, '').trim();
    } else if (data && data.token) {
      token = String(data.token);
    }
    if (token) localStorage.setItem('auth_token', token); else localStorage.removeItem('auth_token');

    try {
      // 토큰 저장 후 내 정보 조회하여 저장
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


