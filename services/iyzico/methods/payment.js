const iyzipay = require("../connection/iyzipay.js");

const createPayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.payment.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  createPayment,
};
