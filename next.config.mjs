/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = (process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
    return [{
      source: '/api/v1/:path*',
      destination: `${backend}/api/v1/:path*`,
    }];
  },
};

export default nextConfig;
