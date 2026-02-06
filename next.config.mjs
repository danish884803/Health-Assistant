// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for API routes to prevent export mismatch
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Ensure proper module resolution
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'mongodb'];
    }
    return config;
  },

  // Environment variables that should be available at build time
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;