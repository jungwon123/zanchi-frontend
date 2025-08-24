"use client";

import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { notificationsState } from "../_state/atoms";
import { useEffect } from "react";
import { getNotifications } from "@/app/_api/notifications";
import { toAbsoluteUrl } from "@/app/_lib/url";
import styled from "styled-components";

const Bar = styled.div`
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px 16px;
`;
const BackBtn = styled.button`
  background: none; border: 0; font-size: 20px;
  width: 28px; height: 28px; cursor: pointer;
  background-image: url('/icon/back.png');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
`;
const Title = styled.h1`
  font-size: 20px; font-weight: 700;
`;
const ClearBtn = styled.button`
  background: none; border: 0; color: #999; font-size: 16px;
`;
const List = styled.div`
  display: grid; gap: 18px; padding: 12px 16px 32px;
`;
const Item = styled.div`
  display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center;
`;
const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 22px; background: #f0d2b6;
`;
const Text = styled.div`
  color: #111; line-height: 1.4;
`;

export default function NotificationsPage() {
  const router = useRouter();
  const [list, setList] = useRecoilState(notificationsState);

  useEffect(() => {
    (async () => {
      try {
        const res = await getNotifications({ page: 0, size: 50 });
        setList(
          res.items.map((n) => ({
            id: n.id,
            type: n.type,
            message: n.text,
            read: n.read,
            createdAt: n.createdAt,
            clipId: n.clipId,
            commentId: n.commentId,
            actorId: n.actorId,
            receiverId: n.receiverId,
            user: n.actorNickname ?? '알 수 없음',
            avatarUrl: n.actorAvatarUrl,
          }))
        );
      } catch (e) { /* ignore */ }
    })();
  }, [setList]);

  const clearAll = () => setList([]);

  return (
    <div style={{ minHeight: '100svh', background: '#fff', color: '#111' }}>
      <Bar>
        <BackBtn onClick={() => router.push('/clip')}></BackBtn>
        <Title>알림</Title>
        <ClearBtn onClick={clearAll}>지우기</ClearBtn>
      </Bar>
      <List>
        {list.map((n) => (
          <Item key={n.id}>
            <Avatar style={{ backgroundImage: n.avatarUrl ? `url(${toAbsoluteUrl(n.avatarUrl)})` : `url(/icon/default.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <Text>
              <strong>{n.user}</strong> {n.message}
            </Text>
          </Item>
        ))}
        {list.length === 0 && <div style={{ color: '#999' }}>알림이 없습니다.</div>}
      </List>
    </div>
  );
}


