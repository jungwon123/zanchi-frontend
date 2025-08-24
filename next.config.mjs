// Vercel 빌드에서 lightningcss 네이티브 바인딩 이슈 회피
process.env.TAILWIND_DISABLE_LIGHTNINGCSS = process.env.TAILWIND_DISABLE_LIGHTNINGCSS || '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizeCss: false, // lightningcss 끔 → PostCSS fallback 사용
  },
};

export default nextConfig;
