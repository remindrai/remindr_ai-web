/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/remindr_ai-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/remindr_ai-web/' : '',
}

module.exports = nextConfig 