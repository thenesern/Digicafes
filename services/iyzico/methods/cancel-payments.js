const iyzipay = require("../connection/iyzipay.js");

const cancelPayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.cancel.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  cancelPayment,
};
