const iyzipay = require("../connection/iyzipay.js");

const createAPayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.subscription.initialize(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  createAPayment,
};
