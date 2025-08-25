"use client";

import React from "react";
import {
  SavesWrap,
  SavesHeader,
  SaveItem,
  SaveIcon,
  SaveTitle,
  SaveDesc,
} from "../_styles";

export default function SavesList({ saves, getRoute, setResult, setView }) {
  return (
    <SavesWrap>
      <SavesHeader>저장 목록</SavesHeader>
      {saves.map((s) => (
        <SaveItem
          key={s.id}
          onClick={async () => {
            try {
              const r = await getRoute(s.id);
              const items = (r.steps || []).map((st) => ({
                id: st.id,
                title: st.name,
                addr: st.address,
                rating: st.rating,
                thumb: "",
                role: st.role,
                mapLink: st.mapLink,
                externalUrl: st.externalUrl,
                link: st.mapLink || st.externalUrl || null,
              }));
              setResult({ items, meta: { fromSaved: true, savedId: r.id } });
              setView("");
            } catch (e) {
              alert("불러오기에 실패했습니다.");
            }
          }}
        >
          <SaveIcon />
          <div>
            <SaveTitle>{s.title || "나의 루트"}</SaveTitle>
            <SaveDesc>{(s.tags || []).slice(0, 3).join(", ")}</SaveDesc>
          </div>
        </SaveItem>
      ))}
      {saves.length === 0 && (
        <div style={{ color: "#888", padding: "16px 0" }}>
          저장된 항목이 없습니다.
        </div>
      )}
    </SavesWrap>
  );
}
