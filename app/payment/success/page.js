"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  React.useEffect(() => {
    const t = setTimeout(() => router.replace('/payment/history'), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{minHeight:'100svh', display:'grid', placeItems:'center', background:'#fff', color:'#111', textAlign:'center', padding:'0 24px'}}>
      <div>
        <div style={{fontWeight:900, fontSize:28, marginBottom:16}}>결제가 완료되었습니다!</div>
        <div style={{color:'#555', lineHeight:1.6}}>예매하기 상단 내 티켓함에서<br/>티켓 확인 가능합니다</div>
      </div>
    </div>
  );
}


