"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px) scale(.98); }
  60% { opacity: 1; transform: translateY(0) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Wrap = styled.div`
  min-height: 100svh; display: grid; place-items: center; background: #fff; color: #111;
`;

const Message = styled.h1`
  font-size: 28px; line-height: 1.4; text-align: center; font-weight: 900; letter-spacing: -0.3px;
  animation: ${fadeUp} 700ms ease both;
`;

export default function WelcomePage(){
  const router = useRouter();

  React.useEffect(() => {
    const t = setTimeout(() => router.push('/onboarding/tutorial'), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Wrap>
      <Message>
        ZANCHI에 온걸
        <br/>
        환영해요!
      </Message>
    </Wrap>
  );
}


