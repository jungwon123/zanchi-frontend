import { ActionsWrap, ActionItem, ActionButton, ActionCount } from "./style";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../../_state/atoms";
import { toggleLike } from "@/app/_api/likes";

export default function RightActions({ likes = 0, comments = 0, saves = 0, shares = 0, onOpenComments, clipId }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const openShare = useSetRecoilState(shareOpenState);
  const onLike = async () => {
    try {
      const res = await toggleLike(clipId);
      setLiked(Boolean(res?.liked));
    } catch (e) {
      // 세션 미인증 등은 서버에서 401/403 혹은 {error:"UNAUTHORIZED"}
      console.error(e);
    }
  };

  return (
    <ActionsWrap>
      <ActionItem>
        <ActionButton aria-label="like" $src={liked ? "/icon/like_p.png" : "/icon/like_s.png"} onClick={onLike} />
        <ActionCount>{likes}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="comments" $src="/icon/comment.png" onClick={onOpenComments}></ActionButton>
        <ActionCount>{comments}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="save" $src={saved ? "/icon/bookmark_p.png" : "/icon/bookmark_s.png"} onClick={() => setSaved((v) => !v)}></ActionButton>
        <ActionCount>{saves}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="share" $src="/icon/share.png" onClick={() => openShare(true)}></ActionButton>
        <ActionCount>{shares}</ActionCount>
      </ActionItem>

    </ActionsWrap>
  );
}


