"use client";

import React from "react";
import Image from "next/image";
import PrimaryButton from "@/app/_components/PrimaryButton";
import {
  Container,
  TopBar,
  TopBtn,
  TopTitle,
  AssignBtn,
  HeroBox,
  Venue,
  Title,
  Subtitle,
  PriceSection,
  PriceRow,
  PriceBig,
  PriceSmall,
  Dday,
  ActionWrap,
  TabsWrap,
  TabButton,
  TabContentHeader,
  GuideImage,
  GuideWrap,
  GuideInfo,
  GuideInfoRow,
  GuideDetails,
  GuideRow,
  GuideBadge,
  GuideDesc,
} from "./_styles";
import EmblaCarousel from "./_components/EmblaCarousel";
import Gallery from "./_components/Gallery";
import MapLink from "./_components/MapLink";
import ExternalLinks from "./_components/ExternalLinks";
import { useRouter } from "next/navigation";
import PeopleSheet from "./_components/PeopleSheet";

export default function TicketPage() {
  const router = useRouter();
  const saleOpen = false; // 1차: 비활성 상태로 시작
  const dday = 10;
  const [activeTab, setActiveTab] = React.useState("guide");
  // 기본 10개 카드(6..10,1..5)
  const baseItems = React.useMemo(() => {
    const ids = Array.from({ length: 10 }, (_, i) => i + 1);
    const ordered = [...ids.slice(5), ...ids.slice(0, 5)];
    return ordered.map((id) => ({
      id,
      thumb: "/images/ticket/question.png",
    }));
  }, []);

  const items = React.useMemo(() => baseItems, [baseItems]);
  const photos = React.useMemo(
    () =>
      new Array(10)
        .fill(0)
        .map((_, i) => `/images/ticket/theater${(i % 5) + 1}.png`),
    []
  );
  const extItems = React.useMemo(
    () => [
      {
        href: "https://blog.naver.com/pine6543/223285246461",
        title: "30년 전 약속 장소였던 그곳, 새롭게 잔치 장소로 탈바꿈하다!",
        meta: "작성자, 피운곳, 출처 등",
      },
      {
        href: "https://blog.naver.com/hidsdmsrud/223688642637/",
        title: "소극장 이야기 두번째 카드 타이틀",
        meta: "작성자, 피운곳, 출처 등",
      },
    ],
    []
  );

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const onConfirmPeople = ({ count, total }) => {
    const params = new URLSearchParams({
      count: String(count),
      total: String(total),
    });
    router.push(`/payment?${params.toString()}`);
  };

  // Section refs for tab scrolling
  const guideRef = React.useRef(null);
  const artistRef = React.useRef(null);
  const venueRef = React.useRef(null);

  const scrollToSection = (ref) => {
    const el = ref?.current;
    if (!el) return;
    const headerH = 96; // fixed TopBar height
    const y = window.scrollY + el.getBoundingClientRect().top - headerH;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <Container>
      <TopBar>
        <TopBtn
          aria-label="back"
          $src="/icon/back.png"
          onClick={() => history.back()}
        />
        <TopTitle>예매하기</TopTitle>
        <AssignBtn
          aria-label="assign"
          $src="/icon/assignment.png"
          onClick={() => router.push("/payment/history")}
        />
      </TopBar>
      <HeroBox>
        <Venue>
          <img
            src="/icon/point.png"
            alt="pin"
            style={{ width: 16, height: 16 }}
          />
          띠아뜨르 다락 소극장
        </Venue>
        <Title>이번달의 띠아뜨르 주인공들은?</Title>
        <Subtitle>두구두구두구</Subtitle>
      </HeroBox>

      <PriceSection>
        <PriceRow>
          <div>
            <PriceBig>1인 20,000원</PriceBig>
            <PriceSmall>정상가 1인 30,000원</PriceSmall>
          </div>
          <Dday>예매 마감까지 D-{dday}</Dday>
        </PriceRow>
      </PriceSection>
      {!sheetOpen && (
        <ActionWrap>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <PrimaryButton onClick={() => setSheetOpen(true)}>
              예매하기
            </PrimaryButton>
          </div>
        </ActionWrap>
      )}
      <TabsWrap>
        <TabButton
          $active={activeTab === "guide"}
          onClick={() => {
            setActiveTab("guide");
            scrollToSection(guideRef);
          }}
        >
          잔치 안내
        </TabButton>
        <TabButton
          $active={activeTab === "artist"}
          onClick={() => {
            setActiveTab("artist");
            scrollToSection(artistRef);
          }}
        >
          잔치러 소개
        </TabButton>
        <TabButton
          $active={activeTab === "venue"}
          onClick={() => {
            setActiveTab("venue");
            scrollToSection(venueRef);
          }}
        >
          소극장 정보
        </TabButton>
      </TabsWrap>

      <div ref={guideRef} />
      <TabContentHeader>잔치안내</TabContentHeader>

      <GuideWrap>
        <GuideImage src="/images/ticket/zanchi1.svg" alt="잔치 안내" />
        <GuideInfo>
          <GuideInfoRow>
            <Image
              src="/icon/calendar.png"
              alt="calendar"
              width={20}
              height={20}
            />
            <span>2025.08.24(월) 14:00</span>
          </GuideInfoRow>
          <GuideInfoRow>
            <Image
              src="/icon/point.png"
              alt="location"
              width={20}
              height={20}
            />
            <span>띠아뜨르 다락 소극장</span>
          </GuideInfoRow>
        </GuideInfo>
        <GuideImage src="/images/ticket/zanchi2.png" alt="잔치 안내" />
        <GuideImage src="/images/ticket/zanchi3.svg" alt="잔치 안내" />

        <GuideDetails>
          <GuideRow style={{ alignItems: "flex-start" }}>
            <GuideBadge>예매 안내</GuideBadge>
            <GuideDesc>
              선착순 예매
              <br />
              예매 정원은 소극장 수요 정원에 따라 상이
              <br />
              띠아뜨르 다락 소극장 : 90명
              <br />
              신포아트홀 : 80명
            </GuideDesc>
          </GuideRow>
          <GuideRow>
            <GuideBadge>입장 안내</GuideBadge>
            <GuideDesc>입장 순서대로 원하는 자리 착석</GuideDesc>
          </GuideRow>
          <GuideRow>
            <GuideBadge>공연 안내</GuideBadge>
            <GuideDesc>공연 시간 - 2시간</GuideDesc>
          </GuideRow>
          <GuideRow>
            <GuideBadge>유의 사항</GuideBadge>
            <GuideDesc>취식 금지, 촬영 금지, 반려 동물 출입 금지</GuideDesc>
          </GuideRow>
        </GuideDetails>
      </GuideWrap>

      <GuideImage src="/images/ticket/zanchi4.svg" alt="잔치 안내" />

      <div ref={artistRef} />
      <TabContentHeader>잔치러 소개</TabContentHeader>
      <EmblaCarousel items={items} />
      <div ref={venueRef} />
      <TabContentHeader>소극장 정보</TabContentHeader>
      {/* 13. 사진 더보기 (컴포넌트) */}
      <Gallery photos={photos} />
      <GuideImage
        src="/images/ticket/theater.svg"
        alt="소극장 정보"
        style={{ padding: "1px" }}
      />

      {/* 14. 지도 링크 (컴포넌트) */}
      <MapLink query="떼아뜨르 다락 소극장" />

      {/* 15. 외부 링크 카드 목록 (컴포넌트) */}
      <ExternalLinks items={extItems} />

      <PeopleSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={onConfirmPeople}
        price={20000}
      />
    </Container>
  );
}
