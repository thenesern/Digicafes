const iyzipay = require("../connection/iyzipay.js");

const refundPayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.refund.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  refundPayment,
};
