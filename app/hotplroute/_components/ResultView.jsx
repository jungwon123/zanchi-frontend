"use client";

import React from "react";
import {
  ResultWrap,
  ResultTop,
  DateText,
  EditBtn,
  Places,
  PlaceItem,
  PlaceTitle,
  AddrRow,
  AddrPin,
  BottomActionsRow,
  RoundBtn,
  TimelineCol,
  TimelineWrap,
  TimelineLine,
  TimelineDot,
  TimelineArrow,
  PlaceCard,
} from "../_styles";
import PrimaryButton from "../../_components/PrimaryButton";

export default function ResultView({
  result,
  dateText,
  setDateText,
  onSave,
  onRerun,
}) {
  const rows = Math.min(4, result.items.length);
  return (
    <ResultWrap>
      <ResultTop>
        <DateText
          value={dateText}
          onChange={(e) => setDateText(e.target.value)}
        />
        <EditBtn
          onClick={() => {
            const v = prompt("날짜를 입력하세요 (YYYY.MM.DD)", dateText);
            if (v) setDateText(v);
          }}
        />
      </ResultTop>
      <Places>
        {Array.from({ length: rows }).map((_, i) => {
          const p = result.items[i];
          const clickable = Boolean(
            p && (p.link || p.mapLink || p.externalUrl)
          );
          return (
            <PlaceItem
              key={p ? p.id : `empty-${i}`}
              onClick={() => {
                if (!p) return;
                const url = p.link || p.mapLink || p.externalUrl;
                if (url) window.location.href = url;
              }}
              role={clickable ? "link" : undefined}
              style={{ cursor: clickable ? "pointer" : undefined }}
            >
              <TimelineCol aria-hidden>
                <TimelineWrap>
                  <TimelineLine $first={i === 0} $last={i === rows - 1} />
                  <TimelineDot>{i + 1}</TimelineDot>
                  {i < rows - 1 && <TimelineArrow />}
                </TimelineWrap>
              </TimelineCol>
              <PlaceCard>
                {p ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <PlaceTitle style={{ marginBottom: 0 }}>
                      {p.title}
                    </PlaceTitle>
                    <AddrRow>
                      <AddrPin />
                      <div>{p.addr}</div>
                    </AddrRow>
                  </div>
                ) : null}
              </PlaceCard>
            </PlaceItem>
          );
        })}
      </Places>
      <BottomActionsRow>
        <RoundBtn
          aria-label="rerun"
          onClick={() => {
            if (typeof onRerun === "function") onRerun();
          }}
        >
          ↺
        </RoundBtn>
        <PrimaryButton onClick={onSave}>저장하기</PrimaryButton>
      </BottomActionsRow>
    </ResultWrap>
  );
}
