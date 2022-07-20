const iyzipay = require("../../connection/iyzipay.js");

const createCompany = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.subMerchant.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  createCompany,
};
