"use client";

import { useRouter } from "next/navigation";
import { BottomNavBar, NavButton, NavIcon } from "./style";

export default function BottomNav({ current = "clip", onChange }) {
  const router = useRouter();
  const items = [
    { key: "clip", label: "클립", icon: "/icon/clip.png" },
    { key: "rank", label: "랭킹", icon: "/icon/rank.png" },
    { key: "upload", label: "업로드", icon: "/icon/upload.png" },
    { key: "ticket", label: "예매하기", icon: "/icon/confirmation.png" },
    { key: "me", label: "내정보", icon: "/icon/profile.png" },
  ];
  const routeMap = {
    clip: "/clip",
    rank: "/rank",
    upload: "/upload",
    ticket: "/ticket",
    me: "/profile",
  };
  return (
    <BottomNavBar>
      {items.map((item) => (
        <NavButton
          key={item.key}
          onClick={() => {
            if (onChange) onChange(item.key);
            const to = routeMap[item.key];
            if (to) router.push(to);
          }}
          $active={current === item.key}
        >
          <NavIcon $src={item.icon} />
          <span>{item.label}</span>
        </NavButton>
      ))}
    </BottomNavBar>
  );
}


