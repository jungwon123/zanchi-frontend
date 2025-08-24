import { MetaWrap, Avatar, MetaTextWrap, FollowBadge, MetaTitle, MetaDesc, ActionItem, ActionButton, MetaHeaderRow } from "./style";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { postActionsState, postActionsOpenState } from "@/app/_state/atoms";
import { useRouter } from "next/navigation";
import { getRelation, toggleFollow, unfollow } from "@/app/_api/profile";

export default function BottomMeta({ profile = { name: "사용자", following: false, id: null }, title = "", desc = "", isMine = false, clipId = null }) {
  const setPostActions = useSetRecoilState(postActionsState);
  const setActionsOpen = useSetRecoilState(postActionsOpenState);
  const router = useRouter();
  const [following, setFollowing] = useState(Boolean(profile.following));
  const [expanded, setExpanded] = useState(false);
  const toAbsoluteUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const base = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) || "https://zanchi.duckdns.org";
    const baseTrimmed = base.replace(/\/+$/, "");
    const pathTrimmed = String(url).replace(/^\/+/, "");
    return `${baseTrimmed}/${pathTrimmed}`;
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!profile?.id || isMine) return;
      try {
        const res = await getRelation(profile.id);
        if (!ignore) setFollowing(Boolean(res?.following));
      } catch {
        // ignore
      }
    })();
    return () => { ignore = true; };
  }, [profile?.id, isMine]);
  return (
    <MetaWrap>
      <Avatar onClick={() => {
        if (isMine) router.push('/profile/me');
        else if (profile.id != null) router.push(`/profile?userId=${profile.id}`);
      }} style={{ cursor: profile.id != null ? 'pointer' : 'default', backgroundImage: `url(${profile?.avatarUrl ? toAbsoluteUrl(profile.avatarUrl) : (profile?.uploaderAvatarUrl ? toAbsoluteUrl(profile.uploaderAvatarUrl) : '/icon/default.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <MetaTextWrap>
        <MetaHeaderRow>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} onClick={() => { if (isMine) router.push('/profile/me'); else if (profile.id != null) router.push(`/profile?userId=${profile.id}`); }}>
          <strong style={{ cursor: profile.id != null ? 'pointer' : 'default' }}>@{profile.name}</strong>
          {!isMine && (
            <FollowBadge onClick={async (e)=>{ e.stopPropagation(); try{
              if (following) { const res = await unfollow(profile.id); setFollowing(Boolean(res?.following)); }
              else { const res = await toggleFollow(profile.id); setFollowing(Boolean(res?.following ?? true)); }
            } catch{} }} style={{ cursor:'pointer' }}>{following ? '팔로잉' : '팔로우'}</FollowBadge>
          )}
          </div>
          <ActionItem>
          <ActionButton
            aria-label="more"
            $src="/icon/tabler_dots.png"
            style={{ backgroundSize: "22px 22px" }}
            onClick={() => { setPostActions({ open: true, uploaderId: profile.id, clipId }); setActionsOpen(true); }}
          ></ActionButton>
        </ActionItem>
        </MetaHeaderRow>
        
        
        
        <MetaTitle onClick={()=> setExpanded((v)=> !v)} style={{ cursor: desc && desc.length>0 ? 'pointer' : 'default' }}>{title}</MetaTitle>
        <MetaDesc style={{ WebkitLineClamp: expanded ? 'unset' : 2, display: expanded ? 'block' : '-webkit-box', overflow: expanded ? 'visible' : 'hidden' }} onClick={()=> setExpanded((v)=> !v)}>
          {desc}
        </MetaDesc>
      </MetaTextWrap>
    </MetaWrap>
  );
}


