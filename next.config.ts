import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
