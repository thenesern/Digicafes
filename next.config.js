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
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  },
});
