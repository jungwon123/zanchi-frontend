"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useMutation } from "@tanstack/react-query";
import { submitSurvey } from "@/app/_api/preferences";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111; display: grid; grid-template-rows: auto auto 1fr auto;
`;
const TopBar = styled.div`
  display: grid; grid-template-columns: auto 1fr; align-items: center; padding: 12px 16px;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent; background-image: url('/icon/back.png'); background-position: center; background-repeat: no-repeat; background-size: contain;
`;
const Title = styled.h1`
  font-size: 24px; font-weight: 900; text-align: center; margin: 8px 16px 6px;
`;
const Subtitle = styled.div`
  text-align: center; color: #777; margin-bottom: 8px;
`;
const Grid = styled.div`
  padding: 8px 16px 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; overflow-y: auto;
`;
const Box = styled.button`
  height: 110px; border-radius: 22px; border: 1px solid #ddd; font-weight: 900; background: ${(p)=> p.$sel ? '#ff7d0a' : '#fff'}; color: ${(p)=> p.$sel ? '#fff' : '#111'};
`;
const BottomBar = styled.div`
  position: sticky; bottom: 0; left: 0; right: 0; padding: 16px; background: #fff; padding-bottom: calc(16px + var(--safe-bottom)); box-shadow: 0 -8px 24px rgba(0,0,0,0.04);
`;

export default function InterestsPage(){
  const router = useRouter();
  const list = [
    '발라드','K-POP','힙합/랩',
    '댄스','팝송','스트릿',
    '뮤지컬','신나는','잔잔한',
    '감성적인','국악','인디',
    '연극','연기','현대무용',
  ];
  const [selected, setSelected] = React.useState([]);

  const toggle = (item) => {
    setSelected((prev) => {
      const has = prev.includes(item);
      if (has) return prev.filter((v)=> v !== item);
      if (prev.length >= 6) return prev; // 최대 6개
      return [...prev, item];
    });
  };

  return (
    <Wrap>
      <TopBar>
        <BackBtn aria-label="back" onClick={()=> router.push('/login')} />
      </TopBar>
      <Title>당신의 취향을 선택해주세요!</Title>
      <Subtitle>최대 6개까지 선택할 수 있어요</Subtitle>

      <Grid>
        {list.map((label)=> (
          <Box key={label} $sel={selected.includes(label)} onClick={()=> toggle(label)}>{label}</Box>
        ))}
      </Grid>

      <BottomBar>
        <PrimaryButton
          disabled={selected.length === 0}
          onClick={async () => {
            // 선택된 라벨을 배열 인덱스(1~15)로 매핑
            const tagIds = selected.map((label) => list.indexOf(label) + 1);
            await submitSurvey(tagIds);
            // 온보딩 완료 → 메인으로 이동
            router.push('/clip');
          }}
        >완료</PrimaryButton>
      </BottomBar>
    </Wrap>
  );
}


