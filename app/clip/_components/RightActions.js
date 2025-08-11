import { ActionsWrap, ActionItem, ActionButton, ActionCount } from "./style";

export default function RightActions({ likes = 0, comments = 0, saves = 0, shares = 0 }) {
  return (
    <ActionsWrap>
      <ActionItem>
        <ActionButton aria-label="like">❤️</ActionButton>
        <ActionCount>{likes}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="comments">💬</ActionButton>
        <ActionCount>{comments}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="save">🔖</ActionButton>
        <ActionCount>{saves}</ActionCount>
      </ActionItem>
      <ActionItem>
        <ActionButton aria-label="share">🔗</ActionButton>
        <ActionCount>{shares}</ActionCount>
      </ActionItem>

    </ActionsWrap>
  );
}


