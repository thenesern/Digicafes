const iyzipay = require("../../connection/iyzipay.js");

const updateCompany = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.subMerchant.update(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  updateCompany,
};
