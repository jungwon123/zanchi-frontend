import { MetaWrap, Avatar, MetaTextWrap, FollowBadge, MetaTitle, MetaDesc, ActionItem, ActionButton, MetaHeaderRow } from "./style";

export default function BottomMeta({ profile = { name: "사용자", following: false }, title = "", desc = "" }) {
  return (
    <MetaWrap>
      <Avatar />
      <MetaTextWrap>
        <MetaHeaderRow>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>@{profile.name}</strong>
          {!profile.following && (<FollowBadge>팔로우</FollowBadge>)}
          </div>
          <ActionItem>
          <ActionButton aria-label="more">⋯</ActionButton>
        </ActionItem>
        </MetaHeaderRow>
        
        
        
        <MetaTitle>{title}</MetaTitle>
        <MetaDesc>{desc}</MetaDesc>
      </MetaTextWrap>
    </MetaWrap>
  );
}


