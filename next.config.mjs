/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint-config-next ha un conflitto di versioni del parser in questo ambiente:
  // il type-check TypeScript resta attivo, la lint si esegue a parte con `npm run lint`.
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] }
  }
};
export default nextConfig;
