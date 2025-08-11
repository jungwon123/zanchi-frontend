"use client";

import { BottomNavBar, NavButton } from "./style";

export default function BottomNav({ current = "clip", onChange }) {
  const items = [
    { key: "clip", label: "클립" },
    { key: "rank", label: "랭킹" },
    { key: "upload", label: "업로드" },
    { key: "ticket", label: "예매하기" },
    { key: "me", label: "내정보" },
  ];
  return (
    <BottomNavBar>
      {items.map((item) => (
        <NavButton key={item.key} onClick={() => onChange?.(item.key)} $active={current === item.key}>
          {item.label}
        </NavButton>
      ))}
    </BottomNavBar>
  );
}


