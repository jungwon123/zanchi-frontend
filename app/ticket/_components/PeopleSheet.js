"use client";

import React from "react";
import styled from "styled-components";
import BottomSheet from "@/app/_components/BottomSheet";
import PrimaryButton from "@/app/_components/PrimaryButton";

const Row = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

const Counter = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  justify-items: center;
  border: 1px solid #ddd;
  border-radius: 16px;
  height: 72px;
`;

const Btn = styled.button`
  width: 48px; height: 48px; display: grid; place-items: center; font-size: 28px; border: 0; background: transparent;
`;

const PayWrap = styled.div`
  padding: 16px; position: sticky; bottom: 0; background: #fff;
`;

export default function PeopleSheet({ open, onClose, price = 20000, max = 4, onConfirm }) {
  const [count, setCount] = React.useState(1);
  const total = count * price;
  const dec = () => setCount((n) => Math.max(1, n - 1));
  const inc = () => setCount((n) => Math.min(max, n + 1));

  const confirm = () => {
    onConfirm?.({ count, total });
    onClose?.();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="인원 선택">
      <Row>
        <div style={{fontWeight: 500}}>인원</div>
        <Counter>
          <Btn onClick={dec}>−</Btn>
          <div style={{fontWeight: 700, fontSize: 24}}>{count}명</div>
          <Btn onClick={inc}>＋</Btn>
        </Counter>
      </Row>
      <PayWrap>
        <PrimaryButton disabled={count < 1} onClick={confirm}>
          {total.toLocaleString()}원 결제하기
        </PrimaryButton>
      </PayWrap>
    </BottomSheet>
  );
}


