const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnoprstuvyzABCDEFGHIJKLMNOPRSTUVYZ",
  20
);
module.exports = nanoid;
