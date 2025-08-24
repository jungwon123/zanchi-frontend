"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Container = styled.div`
  min-height: 100svh; background: #fff; color: #111;
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

const DayTitle = styled.div`
  padding: 16px; font-weight: 900; color: #333; font-size: 16px;
`;

const ItemRow = styled.div`
  display: grid; grid-template-columns: 86px 1fr; gap: 12px; padding: 12px 16px;
`;
const Thumb = styled.div`
  width: 86px; height: 86px; border-radius: 14px; overflow: hidden; background: #FF7D0A;
  display: grid; place-items: center;
`;
const Summary = styled.div`
  display: grid; gap: 8px;
`;
const TitleLine = styled.div`
  font-weight: 900; font-size: 20px; line-height: 1.3;
`;
const MetaLine = styled.div`
  display: grid; grid-template-columns: 20px 1fr; gap: 8px; align-items: center; color: #111;
`;
const MetaIcon = styled.span`
  width: 20px; height: 20px; display: inline-block; background: url(${(p)=>p.$src || 'none'}) center/contain no-repeat;
`;
const Section = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 6px; padding: 8px 16px 18px 16px; color: #888;
`;
const Label = styled.div``;
const Price = styled.div``;

export default function PaymentHistoryPage() {
  const router = useRouter();

  // 데모 데이터
  const days = ['2025.08.06','2025.08.06','2025.08.06'];
  const list = new Array(3).fill(0).map((_,i)=> ({
    id: i+1,
    title: '제목제목제목제목제목',
    date: i===0 ? '2025.08.24(월) 14:00' : '2025.00.00(토) 00:00',
    place: i===0 ? '떼아뜨르 다락 소극장' : '00 소극장 2층 2관',
    item: 20000, point: 15000, total: 5000,
  }));

  return (
    <Container>
      <TopBar>
        <BackBtn onClick={()=> router.back()} />
        <Title>결제 내역</Title>
      </TopBar>

      {days.map((day, idxDay)=> (
        <div key={`d${idxDay}`}>
          <DayTitle>{day}</DayTitle>
          {list.map((it)=> (
            <>
              <ItemRow key={`i${idxDay}-${it.id}`}>
                <Thumb>
                  <Image src="/images/ticket/poster.png" alt="thumb" width={86} height={86} />
                </Thumb>
                <Summary>
                  <TitleLine>{it.title}</TitleLine>
                  <MetaLine><MetaIcon $src="/icon/calendar.png" /><div>{it.date}</div></MetaLine>
                  <MetaLine><MetaIcon $src="/icon/point.png" /><div>{it.place}</div></MetaLine>
                </Summary>
              </ItemRow>
              <Section>
                <Label>[결제 정보]</Label>
              </Section>
              <Section>
                <Label>상품 가격</Label>
                <Price>{it.item.toLocaleString()}원</Price>
              </Section>
              <Section>
                <Label>포인트 사용</Label>
                <Price>{it.point.toLocaleString()}원</Price>
              </Section>
              <Section style={{paddingBottom: 24}}>
                <Label>총 결제 금액</Label>
                <Price>{it.total.toLocaleString()}원</Price>
              </Section>
            </>
          ))}
        </div>
      ))}
    </Container>
  );
}


