/* const {
  createUserCard,
  getUserCard,
  deleteUserCard,
} = require("./methods/cards.js"); */
const Iyzipay = require("iyzipay");
const nanoid = require("../../utils/nanoid.js");
const Installments = require("./methods/installments.js");
const PaymentsThreeDS = require("./methods/threeds-payments.js");
const { createPayment } = require("./methods/payment.js");
const { initialize, getFormPayment } = require("./methods/checkouts.js");
const { cancelPayment } = require("./methods/cancel-payments.js");
const { refundPayment } = require("./methods/refund-payments.js");

const createAPayment = async (req, res) => {
  return createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "A11111",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
    buyer: {
      id: "AA111",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "00000000000",
      lastLoginDate: "2020-10-05 12:33:22",
      registrationDate: "2020-10-05 12:33:22",
      registrationAddress: "Test Tepe, Test Mah. Test Sok. No:2",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Test Tepe, Test Mah. Test Sok. No:2",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "TT11",
        name: "Hizmet Adı",
        category1: "Hizmetler",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "300",
      },
    ],
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
/* createAPayment(); */

const initializeThreeDSPayments = async (data) => {
  console.log(data);
  PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: data.price,
    paidPrice: data.paidPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "A11111",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
    buyer: {
      id: "AA111",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "00000000000",
      lastLoginDate: "2020-10-05 12:33:22",
      registrationDate: "2020-10-05 12:33:22",
      registrationAddress: "Test Tepe, Test Mah. Test Sok. No:2",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Test Tepe, Test Mah. Test Sok. No:2",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "TT11",
        name: "Hizmet Adı",
        category1: "Hizmetler",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "300",
      },
    ],
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// initializeThreeDSPayments();

const completeThreeDSPaymet = () => {
  PaymentsThreeDS.completePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "",
    conversationId: "",
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// completeThreeDSPaymet();

const initializeCheckoutForm = () => {
  initialize({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "A11111",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: "http://localhost:3000/api/checkout/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
    buyer: {
      id: "AA111",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "00000000000",
      lastLoginDate: "2020-10-05 12:33:22",
      registrationDate: "2020-10-05 12:33:22",
      registrationAddress: "Test Tepe, Test Mah. Test Sok. No:2",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Test Tepe, Test Mah. Test Sok. No:2",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "TT11",
        name: "Hizmet Adı",
        category1: "Hizmetler",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "300",
      },
    ],
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// initializeCheckoutForm();

const getCheckoutFormPayment = () => {
  getFormPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    token: "0e5d9e77-afc7-44b8-9eb2-f56e2685ef89",
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// getCheckoutFormPayment();

const cancelPayments = () => {
  cancelPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "17252638",
    ip: "85,34,78,112",
    reason: Iyzipay.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı isteği üzerine iptal edildi.",
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// cancelPayments();

const refundPayments = () => {
  refundPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentTransactionId: "",
    price: "60",
    currency: Iyzipay.CURRENCY.TRY,
    reason: Iyzipay.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı isteği üzerine geri ödeme yapıldı.",
    ip: "85.34.78.112",
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// refundPayments();

module.exports = {
  createPayment,
  initializeThreeDSPayments,
};
