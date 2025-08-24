import { ActionsWrap, ActionItem, ActionButton, ActionCount } from "./style";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { shareOpenState } from "../../_state/atoms";
import { likeClip, unlikeClip } from "@/app/_api/likes";
import { saveClip, unsaveClip } from "@/app/_api/clips";

export default function RightActions({ likes = 0, comments = 0, savesInitial = false, shares = 0, likedInitial = false, onOpenComments, clipId }) {
  const [liked, setLiked] = useState(Boolean(likedInitial));
  const [likeCount, setLikeCount] = useState(likes || 0);
  useEffect(() => { setLikeCount(likes || 0); }, [likes]);
  useEffect(() => { setLiked(Boolean(likedInitial)); }, [likedInitial]);
  // preload icons
  useEffect(() => {
    const img1 = new Image(); img1.src = '/icon/like_s.png';
    const img2 = new Image(); img2.src = '/icon/like_p.png';
    const img3 = new Image(); img3.src = '/icon/bookmark_s.png';
    const img4 = new Image(); img4.src = '/icon/bookmark_p.png';
  }, []);
  const [saved, setSaved] = useState(Boolean(savesInitial));
  const openShare = useSetRecoilState(shareOpenState);
  const onLike = async () => {
    try {
      if (!liked) {
        // like POST
        setLiked(true); setLikeCount((c) => c + 1);
        const res = await likeClip(clipId);
        if (!res?.liked) { setLiked(false); setLikeCount((c) => Math.max(0, c - 1)); }
      } else {
        // unlike DELETE (expect 204)
        setLiked(false); setLikeCount((c) => Math.max(0, c - 1));
        const status = await unlikeClip(clipId);
        if (status !== 204) { setLiked(true); setLikeCount((c) => c + 1); }
      }
    } catch (e) {
      // rollback
      setLiked(Boolean(likedInitial));
      setLikeCount(likes || 0);
      console.error(e);
    }
  };

  const onSave = async () => {
    try {
      if (!saved) {
        setSaved(true);
        const res = await saveClip(clipId);
        if (!res?.saved) setSaved(false);
      } else {
        setSaved(false);
        const status = await unsaveClip(clipId);
        if (status !== 204) setSaved(true);
      }
    } catch (e) {
      setSaved(Boolean(savesInitial));
      console.error(e);
    }
  };

  return (
    <ActionsWrap>
      <ActionItem>
        <ActionButton aria-label="like" $src={liked ? "/icon/like_p.png" : "/icon/like_s.png"} onClick={onLike} />
        <ActionCount>{likeCount}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="comments" $src="/icon/comment.png" onClick={onOpenComments}></ActionButton>
        <ActionCount>{comments}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="save" $src={saved ? "/icon/bookmark_p.png" : "/icon/bookmark_s.png"} onClick={onSave}></ActionButton>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="share" $src="/icon/share.png" onClick={() => openShare(true)}></ActionButton>
        <ActionCount>{shares}</ActionCount>
      </ActionItem>

    </ActionsWrap>
  );
}


