"use client";

import api from "@/app/_lib/axios";

export async function signup({ loginId, name, password }) {
  const { data } = await api.post('/api/signup', { loginId, name, password });
  return data; // { id, loginId, name, createdAt }
}

export async function login({ email, password }) {
  const { data } = await api.post('/api/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_member', JSON.stringify(data.member));
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


