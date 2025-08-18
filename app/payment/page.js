"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/_components/PrimaryButton";

const Wrap = styled.div`
  min-height: 100svh; background: #fff; color: #111;
  padding: 16px 16px calc(120px + var(--safe-bottom));
`;

const TopBar = styled.div`
  display: flex; align-items: center; gap: 12px; height: 56px;
`;
const BackBtn = styled.button`
  width: 28px; height: 28px; border: 0; background: transparent;
  background-image: url('/icon/back.png'); background-repeat: no-repeat; background-position: center; background-size: contain;
`;
const Title = styled.div`
  font-weight: 900; font-size: 20px;
`;

const SectionTitle = styled.div`
  font-weight: 900; font-size: 20px; margin: 18px 0 12px;
`;

const ShowCard = styled.div`
  display: grid; grid-template-columns: 92px 1fr; gap: 12px; align-items: center; border-radius: 16px; 
`;
const Poster = styled.div`
  width: 85px; height: 113px; border-radius: 16px; background: #ddd;
`;
const ShowInfo = styled.div`
  display: grid; gap: 8px;
`;
const Line = styled.div`
  display: flex; align-items: center; gap: 8px; color: #333;
`;
const Icon = styled.span`
  width: 20px; height: 20px; display: inline-block;
  background-image: url(${(p)=> p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: contain;
`;

const PayMethods = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding-top: 12px;
`;
const PayBtn = styled.button`
  height: 56px; border-radius: 12px; border: 0.5px solid #ccc;
  background: ${(p)=> (p.$active ? '#FF7D0A' : '#fff')};
  display: flex; align-items: center; justify-content: center; padding: 6px;
`;
const PayIcon = styled.span`
  width: 100%; height: 100%; display: block;
  background-image: url(${(p)=> p.$src || 'none'});
  background-repeat: no-repeat; background-position: center; background-size: contain;
`;

const PointBox = styled.div`
 border-radius: 12px; padding: 12px 0px; display: grid; gap: 10px;
`;
const PointRow = styled.div`
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px;
`;
const PointInput = styled.input`
  width: 100%; height: 48px; border-radius: 12px; border: 1px solid #ccc; padding: 0 14px; outline: none; font-size: 16px;
  color: ${(p)=> (p.$typed ? '#111' : '#999')};
`;
const PointMeta = styled.div`
  font-size: 12px; color: #777;
`;
const UseAllBtn = styled.button`
  height: 40px; border-radius: 12px; padding: 0 16px; border: 0; background: #ff7d0a; color: #fff; font-weight: 800;
`;

const Summary = styled.div`
  position: relative;
  display: grid; width: 100%; gap: 10px; padding: 12px 0; margin: 16px 0;
  &::before, &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw; /* 패딩과 무관하게 전체 루트 폭 */
    background: #f6f6f6;
    pointer-events: none;
  }
  &::before { top: 0; height: 3px; }
  &::after { bottom: 0; height: 1px; }
`;
const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; color: #333;
`;
const FinalRow = styled(SummaryRow)`
  font-weight: 900; font-size: 22px; color: #111;
`;

const BottomBar = styled.div`
  position: fixed; left: 0; right: 0; bottom: 0; padding: 16px; background: #fff; padding-bottom: calc(16px + var(--safe-bottom));
  box-shadow: 0 -8px 24px rgba(0,0,0,0.04);
`;

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = React.useState("");
  // 총액: SSR과 클라이언트 일치 위해 초기값 고정 후 마운트 시 업데이트
  const [totalAmount, setTotalAmount] = React.useState(40000);
  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = Number(sp.get('total') || 40000);
    setTotalAmount(t);
  }, []);
  const [available, setAvailable] = React.useState(15000);
  const [point, setPoint] = React.useState(0);
  const typed = point > 0;
  const finalAmount = Math.max(0, totalAmount - point);

  const handlePointChange = (v) => {
    const onlyNum = v.replace(/[^0-9]/g, "");
    const num = Math.min(available, parseInt(onlyNum || "0", 10));
    setPoint(num);
  };

  return (
    <Wrap>
      <TopBar>
        <BackBtn onClick={() => router.back()} />
        <Title>결제</Title>
      </TopBar>

      <SectionTitle>공연 정보</SectionTitle>
      <ShowCard>
        <Poster />
        <ShowInfo>
          <div style={{fontWeight: 900, fontSize: 18}}>제목제목제목제목</div>
          <Line><Icon $src="/icon/calendar.png"/>2025.00.00(토) 00:00</Line>
          <Line><Icon $src="/icon/point.png"/>00 소극장 2층 2관</Line>
        </ShowInfo>
      </ShowCard>

      <SectionTitle>결제 수단</SectionTitle>
      <PayMethods>
        {[
          {key: 'npay', label: 'N Pay', src: '/images/payment/naver.png'},
          {key: 'kakao', label: 'Kakao Pay', src: '/images/payment/kakaopay.png'},
          {key: 'toss', label: 'Toss', src: '/images/payment/toss.png'},
          {key: 'paybook', label: 'Paybook', src: '/images/payment/paybook.png'},
        ].map((m) => (
          <PayBtn key={m.key} $active={method===m.key} aria-label={m.label} onClick={()=> setMethod(m.key)}>
            <PayIcon $src={m.src} />
          </PayBtn>
        ))}
      </PayMethods>

      <SectionTitle>포인트</SectionTitle>
      <PointBox>
        <PointRow>
          <PointInput
            value={point ? point.toLocaleString() : ''}
            onChange={(e)=> handlePointChange(e.target.value)}
            inputMode="numeric"
            placeholder="직접 입력하기"
            $typed={typed}
          />
          <UseAllBtn onClick={()=> setPoint(available)}>전액 사용</UseAllBtn>
        </PointRow>
        <PointMeta>보유 포인트: {available.toLocaleString()}P</PointMeta>
      </PointBox>

      <Summary>
      <SectionTitle>결제 금액</SectionTitle>

        <SummaryRow>
          <div>전체 금액</div>
          <div>{totalAmount.toLocaleString()}원</div>
        </SummaryRow>
        <SummaryRow>
          <div>포인트 사용</div>
          <div>{point.toLocaleString()}원</div>
        </SummaryRow>
      </Summary>
      <FinalRow>
        <div>최종 결제 금액</div>
        <div>{finalAmount.toLocaleString()}원</div>
      </FinalRow>

      <div style={{color:'#888', fontSize: 13, lineHeight: 1.6, marginTop: 12}}>
        환불 규정 안내<br/>
        2~3일 전 취소 시 전액 환불<br/>
        1일 전 취소 시 7% 수수료 발생<br/>
        당일 취소 시 환불 불가
      </div>

      <BottomBar>
        <PrimaryButton disabled={!method} onClick={()=> { /* 결제완료로 이동 */ }}>
          {finalAmount.toLocaleString()}원 결제하기
        </PrimaryButton>
      </BottomBar>
    </Wrap>
  );
}



