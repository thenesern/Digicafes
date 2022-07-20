const iyzipay = require("../../connection/iyzipay.js");

const getCompany = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.subMerchant.retrieve(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getCompany,
};
