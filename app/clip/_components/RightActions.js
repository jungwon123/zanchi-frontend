import { ActionsWrap, ActionItem, ActionButton, ActionCount } from "./style";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../../_state/atoms";

export default function RightActions({ likes = 0, comments = 0, saves = 0, shares = 0, onOpenComments }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const openShare = useSetRecoilState(shareOpenState);
  return (
    <ActionsWrap>
      <ActionItem>
        <ActionButton aria-label="like" $src={liked ? "/icon/like_p.png" : "/icon/like_s.png"} onClick={() => setLiked((v) => !v)} />
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


