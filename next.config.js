/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
  },
  sounds: {
    formats: ["audio/mpeg", "audio/mp3"],
  },
};

module.exports = nextTranslate({ nextConfig });
