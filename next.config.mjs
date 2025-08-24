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
