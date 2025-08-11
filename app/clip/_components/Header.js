"use client";

import { useRecoilState } from "recoil";
import { activeTabState } from "../../_state/atoms";
import { HeaderBar, HeaderTabs, HeaderActions, TabButton, IconButton } from "./style";

export default function Header() {
  const [tab, setTab] = useRecoilState(activeTabState);
  return (
    <HeaderBar>
      <HeaderTabs>
        <TabButton onClick={() => setTab("recommend")} $active={tab === "recommend"}>추천</TabButton>
        <TabButton onClick={() => setTab("following")} $active={tab === "following"}>팔로잉</TabButton>
      </HeaderTabs>
      <HeaderActions>
        <IconButton aria-label="search" $src="/icon/search.png" onClick={() => window.location.href = '/search'} />
        <IconButton aria-label="notifications" $src="/icon/bell.png" />
      </HeaderActions>
    </HeaderBar>
  );
}


