import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
