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
    TWILIO_SERVICE_SID: "MG2f914f2fc6bb38cf81209aeded06697a",
    TWILIO_AUTH_TOKEN: "1a1cd30286bf145e487f337e4554af2d",
    TWILIO_ACCOUNT_SID: "AC0e2c1253b45471a1db6890c831b78303",
  },
});
