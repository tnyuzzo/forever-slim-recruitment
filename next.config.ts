import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '/Users/antonio/Documents/Vide Code Project/Copy Forever Slim/recruitment-app',
  },
  allowedDevOrigins: ['127.0.0.1'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.closeragency.eu' }],
        destination: 'https://closeragency.eu/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
