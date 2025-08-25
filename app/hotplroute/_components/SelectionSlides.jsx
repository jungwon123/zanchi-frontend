"use client";

import React from "react";
import {
  Slides,
  Slide,
  Main,
  IntroText,
  Illustration,
  BottomActions,
  RoundBtn,
  CtaBtn,
  SectionTitle,
  TwoCols,
  GhostBtn,
  ButtonsRow,
  FourGrid,
  BottomBar,
} from "../_styles";

export default function SelectionSlides({
  view,
  setView,
  selected,
  setSelected,
  baseCats,
  subMap,
  runPlan,
  getRoutes,
  setSaves,
}) {
  const toggleCategory = (cat) => {
    setSelected((s) => {
      const next = new Set(s.categories);
      if (next.has(cat)) {
        next.delete(cat);
        const nextSub = new Set(
          [...s.sub].filter((x) => !x.startsWith(cat + "|"))
        );
        return { ...s, categories: next, sub: nextSub };
      }
      next.add(cat);
      return { ...s, categories: next };
    });
  };

  const subKey = (cat, name) => `${cat}|${name}`;
  const toggleSub = (cat, name) => {
    setSelected((s) => {
      const next = new Set(s.sub);
      const key = subKey(cat, name);
      if (next.has(key)) next.delete(key);
      else if (next.size < 4) next.add(key);
      return { ...s, sub: next };
    });
  };

  return (
    <Slides>
      <Slide $active={view === "start"} $dir="right">
        <Main $center>
          <IntroText>
            <div>AI가 사용자님의 취향을 분석해</div>
            <div>맞춤형 루트를 추천해요</div>
          </IntroText>
          <div style={{ marginTop: 28 }}>
            <Illustration />
          </div>
        </Main>
        <BottomActions>
          <RoundBtn
            aria-label="menu"
            onClick={async () => {
              try {
                const list = await getRoutes();
                setSaves(list);
                setView("saves");
              } catch (e) {
                setSaves([]);
                setView("saves");
              }
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 24,
                borderTop: "3px solid #fff",
                borderBottom: "3px solid #fff",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 8,
                  borderTop: "3px solid #fff",
                }}
              />
            </span>
          </RoundBtn>
          <CtaBtn onClick={() => setView("venue")}>루트 만들기</CtaBtn>
        </BottomActions>
      </Slide>

      <Slide $active={view === "venue"} $dir="right">
        <Main>
          <SectionTitle>잔치가 어디에서 열리나요?</SectionTitle>
          <TwoCols>
            {["다락소극장", "신포아트홀"].map((t) => (
              <GhostBtn
                key={t}
                $active={selected.venue === t}
                onClick={() => {
                  setSelected((s) => ({ ...s, venue: t }));
                  setView("with");
                }}
              >
                {t}
              </GhostBtn>
            ))}
          </TwoCols>
        </Main>
      </Slide>

      <Slide $active={view === "with"} $dir="right">
        <Main>
          <SectionTitle>누구랑 잔치를 보러왔나요?</SectionTitle>
          <ButtonsRow>
            {["가족", "친구", "연인", "혼자"].map((t) => (
              <GhostBtn
                key={t}
                $active={selected.with === t}
                onClick={() => {
                  setSelected((s) => ({ ...s, with: t }));
                  setView("mobility");
                }}
              >
                {t}
              </GhostBtn>
            ))}
          </ButtonsRow>
        </Main>
      </Slide>

      <Slide $active={view === "mobility"} $dir="right">
        <Main>
          <SectionTitle>어떻게 이동하나요?</SectionTitle>
          <ButtonsRow>
            {["도보", "자전거", "대중교통", "차"].map((m) => (
              <GhostBtn
                key={m}
                $active={selected.mobility === m}
                onClick={() => {
                  setSelected((s) => ({ ...s, mobility: m }));
                  setView("category");
                }}
              >
                {m}
              </GhostBtn>
            ))}
          </ButtonsRow>
        </Main>
      </Slide>

      <Slide $active={view === "category"} $dir="right">
        <Main style={{ paddingTop: 0 }}>
          <SectionTitle>어디를 가고싶나요?</SectionTitle>
          <FourGrid>
            {baseCats.map((t) => (
              <GhostBtn
                key={t}
                $mid={selected.categories.has(t)}
                $active={false}
                onClick={() => toggleCategory(t)}
              >
                {t}
              </GhostBtn>
            ))}
          </FourGrid>

          {baseCats
            .filter((c) => selected.categories.has(c))
            .map((c) => (
              <div key={c} style={{ marginTop: 16 }}>
                <SectionTitle style={{ fontSize: 18, margin: "24px 0 12px" }}>
                  {c}
                </SectionTitle>
                <ButtonsRow>
                  {(subMap[c] || []).map((s) => (
                    <GhostBtn
                      key={c + ":" + s}
                      $active={selected.sub.has(`${c}|${s}`)}
                      onClick={() => toggleSub(c, s)}
                    >
                      {s}
                    </GhostBtn>
                  ))}
                </ButtonsRow>
              </div>
            ))}

          <BottomBar>
            <CtaBtn
              disabled={selected.sub.size === 0 || selected.sub.size > 4}
              onClick={() => runPlan({})}
            >
              코스 추천받기
            </CtaBtn>
          </BottomBar>
        </Main>
      </Slide>
    </Slides>
  );
}
