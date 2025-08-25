"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Wrap>
      <Center>
        <Logo $src="/icon/splash.png" aria-label="zanchi" />
      </Center>
      <Tiger $src="/icon/tiger.png" aria-hidden="true" />
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  background: #fff;
  overflow: hidden;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Tagline = styled.div`
  color: #7a7a7a;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.2px;
  text-align: center;
`;

const Logo = styled.div`
  width: min(395px, 86vw);
  height: 85px;
  background-image: url(${(p) => p.$src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const rise = keyframes`
  from { transform: translate(-50%, 40%); opacity: 0; }
  to { transform: translate(-50%, 0%); opacity: 1; }
`;

const Tiger = styled.div`
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translate(-50%, 0%);
  width: min(760px, 120%);
  height: 300px;
  background-image: url(${(p) => p.$src});
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  pointer-events: none;
  user-select: none;
  animation: ${rise} 900ms ease-out 150ms both;
`;
