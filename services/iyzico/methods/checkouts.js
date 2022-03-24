const iyzipay = require("../connection/iyzipay.js");

const initialize = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getFormPayment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  initialize,
  getFormPayment,
};
