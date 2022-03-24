const iyzipay = require("../connection/iyzipay.js");

const createUserCard = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.card.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getUserCard = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.cardList.retrieve(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteUserCard = async (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.card.delete(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  createUserCard,
  getUserCard,
  deleteUserCard,
};
