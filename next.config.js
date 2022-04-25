/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  sounds: {
    formats: ["audio/mpeg", "audio/mp3"],
  },
};

module.exports = nextConfig;
