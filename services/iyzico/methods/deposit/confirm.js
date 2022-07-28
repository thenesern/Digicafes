const iyzipay = require("../../connection/iyzipay.js");

const confirmDeposit = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.approval.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  confirmDeposit,
};
