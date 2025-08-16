"use client";

import React from "react";
import styled from "styled-components";

const MapBox = styled.a`
  display: block; width: 100%;
  padding: 12px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background: #f2f2f2;
`;

const MapBoxWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px;
`;

export default function MapLink({ query }) {
  const href = `https://map.naver.com/v5/search/${encodeURIComponent(query || "떼아뜨르 다락 소극장")}`;
  return <MapBoxWrap>
    <MapBox href={href} target="_blank" rel="noreferrer" />
  </MapBoxWrap>;
}


