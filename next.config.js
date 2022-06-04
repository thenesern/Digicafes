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
  env: {
    GA_TRACKING_ID: "G-4Y5T6H6FBL",
  },
});
