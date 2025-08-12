/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  swcMinify: false,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig