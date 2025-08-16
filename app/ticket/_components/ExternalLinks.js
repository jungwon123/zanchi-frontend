"use client";

import React from "react";
import styled from "styled-components";

const ExtList = styled.div`
display: flex;
flex-direction: column;
gap: 12px;
padding: 12px;
`;

const ExtCard = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 16px; 
  text-decoration: none; color: inherit;
`;

const ExtThumb = styled.div`
  min-width: 120px; height: 90px; border-radius: 12px; background: #eee; overflow: hidden;
`;

const ExtTitle = styled.div`
  font-weight: 800; font-size: 16px; line-height: 1.4; color: #111;
`;

const ExtMeta = styled.div`
  margin-top: 6px; color: #999; font-size: 12px;
`;


const ExtInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
`;
const ExtWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export default function ExternalLinks({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <ExtList>
      {items.map((it) => (
        <ExtCard key={it.href} href={it.href} target="_blank" rel="noreferrer">
          <ExtWrap>
          <ExtThumb />
          <ExtInfo>
            <ExtTitle>{it.title}</ExtTitle>
            <ExtMeta>{it.meta}</ExtMeta>
          </ExtInfo>
          </ExtWrap>
        </ExtCard>
      ))}
    </ExtList>
  );
}


