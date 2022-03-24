const {
  createUserCard,
  getUserCard,
  deleteUserCard,
} = require("./methods/cards.js");
const Iyzipay = require("iyzipay");
const nanoid = require("../../utils/nanoid.js");
const Logs = require("../../utils/logs.js");
const Installments = require("./methods/installments.js");
const PaymentsThreeDS = require("./methods/threeds-payments.js");
const { createAPayment } = require("./methods/payment.js");
const { initialize, getFormPayment } = require("./methods/checkouts.js");

const createUserAndCards = () => {
  createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    card: {
      cardAlias: "Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs("1-cards-kullanıcı-ve-kart-oluştur", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("1-cards-kullanıcı-ve-kart-oluştur-hata", err);
    });
};

// createUserAndCards();

const createCardForUser = () => {
  createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
    card: {
      cardAlias: "Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs("2-cards-bir-kullanıcıya-kart-ekle", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("2-cards-bir-kullanıcıya-kart-ekle -hata", err);
    });
};
// createCardForUser();

const readCardsOfUser = () => {
  getUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
  })
    .then((result) => {
      console.log(result);
      Logs("3-cards-kullanıcının-kartlarını-oku", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("3-cards-kullanıcının-kartlarını-oku-hata", err);
    });
};

// readCardsOfUser();

const deleteCardsOfUser = () => {
  deleteUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
    cardToken: "B2cSfQs0pEsN26OndAC+bq2WjCk=",
  })
    .then((result) => {
      console.log(result);
      Logs("4-cards-kullanıcının-kartlarını-sil", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("4-cards-kullanıcının-kartlarını-sil-hata", err);
    });
};

// deleteCardsOfUser();

const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    binNumber: "552879",
    price: "1000",
  })
    .then((result) => {
      console.log(result);
      Logs("5-cards-taksit-kontrol", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("5-cards-taksit-kontrol-hata", err);
    });
};

// checkInstallments();

const createPayment = () => {
  return createAPayment({
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
      Logs("6-payments-yeni-kartla-ödeme-al", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("6-payments-yeni-kartla-ödeme-al-hata", err);
    });
};

// createPayment();

const initializeThreeDSPayments = () => {
  PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
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
      Logs("7-payments-yeni-kartla-ödeme-threeDS-başlat", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("7-payments-yeni-kartla-ödeme-threeDS-başlat-hata", err);
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
      Logs("8-payments-yeni-kartla-ödeme-threeDS-tamamla", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("8-payments-yeni-kartla-ödeme-threeDS-tamamla-hata", err);
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
    callbackUrl: "https://localhost/api/checkout/complete/payment",
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
      Logs("13-checkout-form-payments", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("13-checkout-form-payments-hata", err);
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
      Logs("14-checkout-form-payments-detaylar", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("14-checkout-form-payments--detaylar-hata", err);
    });
};
getCheckoutFormPayment();
