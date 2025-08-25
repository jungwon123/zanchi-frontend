"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";

const NavBar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  padding-bottom: var(--safe-bottom);
  background: rgba(0, 0, 0, 0.8);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  z-index: 20;
  padding: 0 16px;
`;
const Btn = styled.button`
  display: grid;
  place-items: center;
  gap: 6px;
  background: none;
  border: 0;
  color: ${(p) => (p.$active ? "#fff" : "#aaa")};
  font-size: 12px;
`;
const Icon = styled.span`
  width: 24px;
  height: 24px;
  display: inline-block;
  background-image: url(${(p) => p.$src || "none"});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export default function BottomNav({ current = "clip", onChange }) {
  const router = useRouter();
  const items = [
    { key: "clip", label: "클립", icon: "/icon/clip.png", to: "/clip" },
    { key: "rank", label: "랭킹", icon: "/icon/rank.png", to: "/ranking" },
    { key: "upload", label: "업로드", icon: "/icon/upload.png", to: "/upload" },
    {
      key: "ticket",
      label: "예매하기",
      icon: "/icon/confirmation.png",
      to: "/ticket",
    },
    {
      key: "me",
      label: "내정보",
      icon: "/icon/profile.png",
      to: "/profile/me",
    },
  ];
  return (
    <NavBar>
      {items.map((it) => (
        <Btn
          key={it.key}
          $active={current === it.key}
          onClick={() => {
            onChange?.(it.key);
            if (it.to) router.push(it.to);
          }}
        >
          <Icon $src={it.icon} $active={current === it.key} />
          <span>{it.label}</span>
        </Btn>
      ))}
    </NavBar>
  );
}
