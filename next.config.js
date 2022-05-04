/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/jpg", "image/webp"],
    domains: ["res.cloudinary.com"],
  },
  sounds: {
    formats: ["audio/mpeg", "audio/mp3"],
  },
};

module.exports = nextConfig;
