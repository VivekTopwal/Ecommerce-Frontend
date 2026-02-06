/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/products/**',
      },
    ],
    
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;