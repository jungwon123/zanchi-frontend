"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/app/_api/auth";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111; display: grid; grid-template-rows: auto 1fr auto;
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 8px; padding: 12px 16px;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent; background-image: url('/icon/back.png'); background-position: center; background-repeat: no-repeat; background-size: contain;
`;
const Title = styled.div`
  font-weight: 900; font-size: 20px;
`;

const Section = styled.div`
  padding: 0 16px; display: grid; gap: 16px; align-content: start;
`;
const Step = styled.div`
  overflow: hidden;
  transition: opacity 240ms ease, transform 240ms ease, max-height 300ms ease;
  opacity: ${(p)=> (p.$active ? 1 : 0)};
  transform: translateY(${(p)=> (p.$active ? '0' : '8px')});
  max-height: ${(p)=> (p.$active ? '1000px' : '0')};
`;
const Field = styled.div`
  position: relative;
`;
const Input = styled.input`
  width: 100%; height: 56px; border-radius: 16px; border: 1px solid #ddd; padding: 0 48px 0 16px; outline: none; font-size: 18px;
`;
const ClearBtn = styled.button`
  position: absolute; right: 44px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border: 0; border-radius: 14px; background: #eee; color: #666;
`;
const EyeBtn = styled.button`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border: 0; border-radius: 14px; background: transparent;
`;
const Helper = styled.div`
  color: #d9534f; padding: 4px 4px 0 4px; font-size: 14px; min-height: 20px;
`;
const Hint = styled.div`
  color: #777; font-size: 14px; padding: 0 4px;
`;

const RightBtn = styled.button`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%); height: 36px; padding: 0 12px; border: 0; border-radius: 10px; background: #ff7d0a; color: #fff; font-weight: 800;
`;

const BottomBar = styled.div`
  position: fixed; left: 0; right: 0; bottom: 0; padding: 16px; background: #fff; padding-bottom: calc(16px + var(--safe-bottom)); box-shadow: 0 -8px 24px rgba(0,0,0,0.04);
`;

export default function SignupPage(){
  const router = useRouter();
  const [id, setId] = React.useState(""); // loginId
  const [pw, setPw] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState(1); // 1: 계정정보, 2: 전화인증, 3: 이름
  const [pwVis1, setPwVis1] = React.useState(false);
  const [pwVis2, setPwVis2] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [expectedCode, setExpectedCode] = React.useState("");
  const [kbBottom, setKbBottom] = React.useState(0);

  React.useEffect(()=>{
    const vv = window.visualViewport; if(!vv) return;
    const update = () => setKbBottom(Math.max(0, (window.innerHeight - vv.height - vv.offsetTop)));
    vv.addEventListener('resize', update); vv.addEventListener('scroll', update); update();
    return ()=>{ vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  },[]);

  // validations
  const idTaken = id === 'sing_zanchi';
  const pwValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(pw);
  const pwMatch = pw && pw2 && pw === pw2;
  const phoneValid = /^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone);
  const codeValid = codeSent && code === expectedCode && code.length > 0;
  const stage1Ok = id && !idTaken && pwValid && pwMatch;
  const stage2Ok = phoneValid && codeValid;
  const stage3Ok = name.length > 0;
  const canSubmit = stage1Ok && stage2Ok && stage3Ok;

  // 자동 스텝 전환 (유효성 만족 시 다음 단계로 이동)
  React.useEffect(()=>{ if(step === 1 && stage1Ok) setStep(2); }, [step, stage1Ok]);
  React.useEffect(()=>{ if(step === 2 && stage2Ok) setStep(3); }, [step, stage2Ok]);

  const sendCode = () => {
    if(!phoneValid) return; 
    setExpectedCode('123456'); setCodeSent(true);
    // 실제에선 서버로 전송
  };

  const mut = useMutation({
    mutationFn: () => signup({ loginId: id, name, password: pw }),
    onSuccess: () => router.push('/onboarding/interests'),
  });

  const submit = () => {
    if(!canSubmit) return;
    mut.mutate();
  };

  return (
    <Wrap>
      <TopBar>
        <BackBtn aria-label="back" onClick={()=> router.back()} />
        <Title>회원가입</Title>
      </TopBar>

      <Section>
        <Step $active={step===1} aria-hidden={step!==1}>
            <Field>
              <Input placeholder="아이디(로그인 ID)" value={id} onChange={(e)=> setId(e.target.value)} />
              {id && <ClearBtn onClick={()=> setId('')}>×</ClearBtn>}
            </Field>
            <Helper>{id && idTaken ? '이미 존재하는 아이디입니다.' : ''}</Helper>

            <Field>
              <Input type={pwVis1? 'text':'password'} placeholder="비밀번호" value={pw} onChange={(e)=> setPw(e.target.value)} />
              {pw && <ClearBtn onClick={()=> setPw('')}>×</ClearBtn>}
              <EyeBtn onClick={()=> setPwVis1(v=>!v)}>{pwVis1? '🙈':'👁️'}</EyeBtn>
            </Field>
            <Hint>8자리 이상, 대소문자, 숫자, 특수문자 포함</Hint>
            <Helper>{pw && !pwValid ? '조건이 일치하지 않습니다' : ''}</Helper>

            <Field>
              <Input type={pwVis2? 'text':'password'} placeholder="비밀번호 확인" value={pw2} onChange={(e)=> setPw2(e.target.value)} />
              {pw2 && <ClearBtn onClick={()=> setPw2('')}>×</ClearBtn>}
              <EyeBtn onClick={()=> setPwVis2(v=>!v)}>{pwVis2? '🙈':'👁️'}</EyeBtn>
            </Field>
            <Helper>{pw2 && !pwMatch ? '비밀번호가 일치하지 않습니다' : ''}</Helper>
        </Step>

        <Step $active={step===2} aria-hidden={step!==2}>
            <Field>
              <Input placeholder="휴대폰번호" value={phone} onChange={(e)=> setPhone(e.target.value)} />
              {phone && <ClearBtn onClick={()=> setPhone('')}>×</ClearBtn>}
              <RightBtn onClick={sendCode}>인증받기</RightBtn>
            </Field>
            <Helper>{phone && !phoneValid ? '올바르지 않은 번호입니다' : ''}</Helper>

            <Field>
              <Input placeholder="인증번호" value={code} onChange={(e)=> setCode(e.target.value)} />
              {code && <ClearBtn onClick={()=> setCode('')}>×</ClearBtn>}
            </Field>
            <Helper>{code && codeSent && code !== expectedCode ? '일치하지 않습니다' : ''}</Helper>
        </Step>

        <Step $active={step===3} aria-hidden={step!==3}>
            <Field>
              <Input placeholder="이름" value={name} onChange={(e)=> setName(e.target.value)} />
              {name && <ClearBtn onClick={()=> setName('')}>×</ClearBtn>}
            </Field>
            <Hint>가입 후 내정보에서 변경할 수 있습니다</Hint>
        </Step>
      </Section>

      <BottomBar style={{ bottom: `calc(${kbBottom}px)`, transition: 'bottom 160ms ease' }}>
        {step < 3 ? (
          <PrimaryButton disabled={step===1 ? !stage1Ok : !stage2Ok} onClick={()=> setStep((s)=> Math.min(3, s+1))}>다음</PrimaryButton>
        ) : (
          <PrimaryButton disabled={!canSubmit} onClick={submit}>회원가입</PrimaryButton>
        )}
      </BottomBar>
    </Wrap>
  );
}


