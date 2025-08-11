"use client";

import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --app-bg: transparent;
    --app-fg: #ffffff;
  }
  html, body {
    background: var(--app-bg);
    color: var(--app-fg);
  }
`;

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
`;


