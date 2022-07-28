const iyzipay = require("../../connection/iyzipay.js");

const cancelDeposit = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.disapproval.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  cancelDeposit,
};
