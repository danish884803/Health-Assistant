/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;