"use client";

import { useRecoilState } from "recoil";
import { activeTabState } from "../../_state/atoms";
import { HeaderBar, HeaderTabs, HeaderActions, HeaderLeft, TabButton, IconButton } from "./style";

export default function Header() {
  const [tab, setTab] = useRecoilState(activeTabState);
  return (
    <HeaderBar>
      <HeaderLeft>
        <IconButton aria-label="hotplroute" $src="/icon/hotpl.png" onClick={() => window.location.href = '/hotplroute'} />
      </HeaderLeft>
      <HeaderTabs>
        <TabButton onClick={() => setTab("recommend")} $active={tab === "recommend"}>추천</TabButton>
        <TabButton onClick={() => setTab("following")} $active={tab === "following"}>팔로잉</TabButton>
      </HeaderTabs>
      <HeaderActions>
        <IconButton aria-label="search" $src="/icon/search.png" onClick={() => window.location.href = '/search'} style={{ backgroundSize: "30px 30px" }} />
        <IconButton aria-label="notifications" $src="/icon/bell.png" onClick={() => window.location.href = '/notifications'} style={{ backgroundSize: "30px 30px" }} />
      </HeaderActions>
    </HeaderBar>
  );
}


