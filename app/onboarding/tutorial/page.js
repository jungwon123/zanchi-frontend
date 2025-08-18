"use client";

import React from "react";
import styled from "styled-components";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useRouter } from "next/navigation";

const Wrap = styled.div`
  min-height: 100svh; display: grid; grid-template-rows: auto 1fr auto; background: #fff; color: #111;
`;

const ProgressWrap = styled.div`
  position: sticky; top: 0; left: 0; right: 0; height: 6px; background: #ffe3cd;
`;
const ProgressBar = styled.div`
  height: 100%; background: #ff7d0a; width: ${(p)=>p.$percent}%; transition: width 240ms ease; border-radius: 0px 12px 12px 0px;
`;

const Slide = styled.div`
  padding: 16px; display: grid; justify-items: center; align-content: center; overflow: hidden;
`;
const Img = styled.img`
  width: 100%; height: 612px; object-fit: contain;
`;

const BottomBar = styled.div`
  position: sticky; bottom: 0; left: 0; right: 0; padding: 16px; background: #fff; padding-bottom: calc(16px + var(--safe-bottom)); box-shadow: 0 -8px 24px rgba(0,0,0,0.04);
`;

export default function TutorialPage(){
  const router = useRouter();
  const slides = [{}, {}, {}];
  const imgs = [
    '/images/tutorial/tutorial1.svg',
    '/images/tutorial/tutorial2.svg',
    '/images/tutorial/tutorial3.svg',
  ];
  const [step, setStep] = React.useState(0);
  const total = slides.length;
  const percent = ((step+1)/total)*100;

  const next = () => {
    if (step < total-1) setStep(step+1);
    else router.push('/');
  };

  return (
    <Wrap>
      <ProgressWrap>
        <ProgressBar $percent={percent} />
      </ProgressWrap>
      <Slide>
        <Img src={imgs[step]} alt="tutorial" />
      </Slide>
      <BottomBar>
        <PrimaryButton onClick={next}>{step === total-1 ? '잔치 구경하러 가기' : '다음'}</PrimaryButton>
      </BottomBar>
    </Wrap>
  );
}


