/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
  },
  sounds: {
    formats: ["audio/mpeg", "audio/mp3"],
  },
});
