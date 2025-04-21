/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Remindr_AI_Web_UI' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Remindr_AI_Web_UI/' : '',
}

module.exports = nextConfig 