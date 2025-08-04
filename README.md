# zanchi-frontend
멋쟁이 사자처럼 13기 중앙해커톤 골목대장(잔치)

<div align="center">
  <h1>🎥 ZANCHI: 짧은 순간이 모이는 공간</h1>
  <p>틱톡, 인스타 릴스처럼 짧은 영상을 공유하고 감상하는 감각적인 웹 앱</p>

 <img src="https://img.shields.io/badge/Tech-Next.js%20|%20React%20|%20Recoil%20|%20styled--components-blue" alt="Tech Stack" />
<img src="https://img.shields.io/github/last-commit/your-username/zanchi-frontend" alt="Last Commit" />

</div>

---

## 🚀 프로젝트 소개

**Zanchi**는 누구나 짧은 영상을 올리고, 감상하고, 반응할 수 있는 **릴스형 SNS 웹 앱**입니다.  
`Next.js`와 `React` 기반으로 제작되었으며, 빠른 렌더링과 모바일 최적화를 목표로 개발되었습니다.

> “즐거운 콘텐츠의 잔치(Zanchi), 영상으로 연결되는 사람들”

---

## 🖼️ 주요 기능

- 📱 무한 스크롤 기반 영상 피드
- 🎞️ `react-player` + `hls.js` 기반 영상 재생
- 🚦 `IntersectionObserver`로 Lazy Load + Autoplay 제어
- ❤️ 좋아요, 댓글 기능 (추후 확장 예정)
- 🖥️ 반응형 UI, 모바일 최적화

---

## 🛠️ 사용 기술 스택

| 영역        | 기술 |
|-------------|------|
| 프레임워크   | `Next.js`, `React` |
| 상태관리     | `useState`, `useEffect`, `React Query` (선택사항) |
| 영상 처리    | `react-player`, `hls.js` |
| 스타일링     | `styled-components` or `Tailwind CSS` |
| 빌드 도구    | `Vite`, `ESLint`, `Prettier` |
| 배포 환경    | `Vercel`, `GitHub Pages` 등 |

---

## 📂 프로젝트 구조

```bash
zanchi-frontend/
├── public/             # 정적 파일
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/          # Next.js 라우팅 페이지
│   ├── hooks/          # 커스텀 훅
│   ├── api/            # API 호출 관련 로직
│   ├── styles/         # 전역 스타일
│   ├── utils/          # 유틸 함수
│   └── types/          # 타입 정의 (TS 사용 시)
├── .eslintrc.js
├── .prettierrc
├── package.json
└── README.md
