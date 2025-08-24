// Vercel 빌드에서 lightningcss 네이티브 바인딩 이슈 회피
process.env.TAILWIND_DISABLE_LIGHTNINGCSS = process.env.TAILWIND_DISABLE_LIGHTNINGCSS || '1';

const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
