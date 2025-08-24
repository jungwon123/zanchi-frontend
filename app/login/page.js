"use client";

import React from "react";
import styled from "styled-components";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/app/_api/auth";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111;
  display: grid; grid-template-rows: auto 1fr auto;
`;

const Header = styled.div`
  padding: 16px 16px 30px; text-align: center;
  transition: transform 220ms ease, opacity 220ms ease;
`;
const Logo = styled.img`
  display: inline-block; width: 100%; height: auto;
`;

const Form = styled.div`
  padding: 0 16px; display: grid; gap: 16px; align-content: start;
  transition: transform 220ms ease, opacity 220ms ease;
`;

const Field = styled.div`
  position: relative;
`;
const Input = styled.input`
  width: 100%; height: 56px; border-radius: 16px; border: 1px solid #ddd; padding: 0 44px 0 16px; outline: none; font-size: 18px;
`;
const ClearBtn = styled.button`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 28px; height: 28px; border: 0; border-radius: 14px; background: #eee; color: #666;
`;
const ToggleBtn = styled(ClearBtn)``;

const Helper = styled.div`
  color: #d9534f; padding: 4px 4px 0 4px; font-size: 14px; min-height: 20px;
`;

const Hint = styled.div`
  padding: 16px; text-align: center; color: #777;
  & a{ color: #ff7d0a; font-weight: 800; text-decoration: none; }
`;

const BottomBar = styled.div`
  position: fixed; left: 0; right: 0; bottom: 0; padding: 16px; background: #fff;
  padding-bottom: calc(16px + var(--safe-bottom));
  box-shadow: 0 -8px 24px rgba(0,0,0,0.04);
  transition: bottom 220ms ease;
`;

export default function LoginPage(){
  const router = useRouter();
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const [kbBottom, setKbBottom] = React.useState(0);
  const kbShown = kbBottom > 0;

  React.useEffect(()=>{
    const vv = window.visualViewport;
    if(!vv) return;
    const update = () => {
      const offset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      setKbBottom(Math.round(offset));
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  },[]);

  const mut = useMutation({
    mutationFn: () => login({ loginId: id, password: pw }),
    onSuccess: () => router.push('/onboarding/interests'),
    onError: () => setError('로그인에 실패했습니다'),
  });

  const submit = () => {
    if(!id || !pw){ setError('아이디 또는 비밀번호를 입력해 주세요'); return; }
    mut.mutate();
  };

  return (
    <Wrap>
      <Header style={{ transform: kbShown ? 'translateY(-8px)' : 'none', opacity: kbShown ? .92 : 1 }}>
        <Logo src="/icon/logo.png" alt="ZANCHI" />
      </Header>
      <Form style={{ transform: kbShown ? 'translateY(-8px)' : 'none' }}>
        <Field>
          <Input placeholder="아이디를 입력해 주세요" value={id} onChange={(e)=> setId(e.target.value)} />
          {id && <ClearBtn onClick={()=> setId("")}>×</ClearBtn>}
        </Field>
        <Field>
          <Input type={visible? 'text':'password'} placeholder="비밀번호를 입력해 주세요" value={pw} onChange={(e)=> setPw(e.target.value)} />
          {pw && <ToggleBtn onClick={()=> setVisible(v=>!v)}>{visible? '🙈':'👁️'}</ToggleBtn>}
        </Field>
        <Helper>{error}</Helper>
        <Hint>아직 잔치 계정이 없나요? <a href="#" onClick={(e)=> {e.preventDefault(); router.push('/signup');}}>회원가입</a></Hint>
      </Form>

      <BottomBar style={{ bottom: `calc(${kbBottom}px)` }}>
        <PrimaryButton disabled={!id || !pw} onClick={submit}>로그인</PrimaryButton>
      </BottomBar>
    </Wrap>
  );
}


