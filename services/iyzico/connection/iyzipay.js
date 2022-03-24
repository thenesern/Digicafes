const Iyzipay = require("iyzipay");
const dotenv = require("dotenv");
dotenv.config();

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI,
});

module.exports = iyzipay;
