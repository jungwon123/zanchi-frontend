"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { Wrap, TopBar, BackBtn, Title, SectionTitle, ShowCard, Poster, ShowInfo, Line, Icon, PayMethods, PayBtn, PayIcon, PointBox, PointRow, PointInput, PointMeta, UseAllBtn, Summary, SummaryRow, FinalRow, BottomBar } from "./_styles";

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
        <PrimaryButton
          disabled={!method}
          onClick={() => {
            router.push('/payment/success');
          }}
        >
          {finalAmount.toLocaleString()}원 결제하기
        </PrimaryButton>
      </BottomBar>
    </Wrap>
  );
}



