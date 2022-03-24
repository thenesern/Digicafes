const iyzipay = require("../connection/iyzipay.js");

const initializePayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.threedsInitialize.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const completePayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.threedsPayment.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  initializePayment,
  completePayment,
};
