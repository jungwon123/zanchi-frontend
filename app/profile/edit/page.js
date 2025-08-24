"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateName } from "@/app/_api/profile";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111; padding-bottom: calc(16px + var(--safe-bottom));
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #f0f0f0;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent; background-image: url('/icon/back.png'); background-position: center; background-repeat: no-repeat; background-size: contain;
`;
const Title = styled.div`
  font-weight: 900; font-size: 18px;
`;

const AvatarArea = styled.div`
  display: grid; place-items: center; padding: 24px 0 8px;
`;
const Avatar = styled.button`
  width: 120px; height: 120px; border-radius: 60px; border: 0; background: #f1cfae; display: grid; place-items: center; font-weight: 800; color: #fff;
`;
const Hint = styled.div`
  text-align: center; color: #666; margin-top: 8px;
`;

const Form = styled.div`
  padding: 16px;
  display: grid; gap: 16px;
`;
const Row = styled.label`
  display: grid; grid-template-columns: 80px 1fr; align-items: center; gap: 12px;
`;
const Input = styled.input`
  height: 44px; border-radius: 12px; padding: 0 12px; outline: none;
`;
const TextArea = styled.textarea`
  min-height: 80px; border-radius: 12px; padding: 12px; outline: none; resize: vertical;
`;

export default function EditProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = React.useState('노래하는 잔치러');
  const [handle, setHandle] = React.useState('sing_zanchi');
  const [bio, setBio] = React.useState('소개');
  const [link, setLink] = React.useState('링크');

  const mut = useMutation({ mutationFn: () => updateName(nickname) });

  return (
    <Wrap>
      <TopBar>
        <BackBtn onClick={()=> router.back()} />
        <Title>프로필 편집</Title>
      </TopBar>

      <AvatarArea>
        <Avatar/>
        <Hint>사진 수정</Hint>
      </AvatarArea>

      <Form>
        <Row>
          <span>닉네임</span>
          <Input value={nickname} onChange={(e)=> setNickname(e.target.value)} />
        </Row>
        <Row>
          <span>아이디</span>
          <Input value={handle} onChange={(e)=> setHandle(e.target.value)} />
        </Row>
        <Row>
          <span>소개</span>
          <Input value={bio} onChange={(e)=> setBio(e.target.value)} />
        </Row>
        <Row>
          <span>링크</span>
          <Input value={link} onChange={(e)=> setLink(e.target.value)} placeholder="https://" />
        </Row>
      </Form>
      <div style={{ padding: 16 }}>
        <button onClick={() => mut.mutate()} style={{ width: '100%', height: 48, borderRadius: 12, border: 0, background: '#ff7d0a', color: '#fff', fontWeight: 800 }}>저장</button>
      </div>
    </Wrap>
  );
}


