import moment from "moment";
import { initializeThreeDSPayments } from "../../../../services/iyzico/index.js";
import { CompletePayment } from "../../../../utils/payments.js";
import nc from "next-connect";
import db from "../../../../utils/db";
import nanoid from "../../../../utils/nanoid.js";
import Iyzipay from "iyzipay";
const handler = nc();
const PaymentsThreeDS = require("../../../../services/iyzico/methods/threeds-payments.js");

handler.post(async (req, res) => {
  await PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: req.body.product.price,
    paidPrice: req.body.product.paidPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: req.body.order.id,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: "http://localhost:3000/api/checkout/payment/3ds/complete",
    paymentCard: {
      cardHolderName: req.body.card.name,
      cardNumber: req.body.card.number,
      expireMonth: req.body.card.month,
      expireYear: req.body.card.year,
      cvc: req.body.card.cvc,
      registerCard: "0",
    },
    buyer: {
      id: req.body.user.id,
      name: req.body.user.firstName,
      surname: req.body.user.lastName,
      gsmNumber: "+905350000000",
      email: req.body.user.email,
      identityNumber: "00000000000",
      lastLoginDate: req.body.user.signedIn,
      registrationDate: "2020-10-05 12:33:22",
      registrationAddress: "Test Tepe, Test Mah. Test Sok. No:2",
      ip: req.body.user.ip,
      city: "Ankara",
      country: "Turkey",
      zipCode: "06000",
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Test Tepe, Test Mah. Test Sok. No:2",
      zipCode: "34732",
    },
    basketItems: req.body.basketItems,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  /*  const data = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: req.body.product.price,
    paidPrice: req.body.product.price,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: nanoid(),
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    paymentCard: {
      cardHolderName: req.body.card.name,
      cardNumber: req.body.card.number,
      expireMonth: req.body.card.month,
      expireYear: req.body.card.year,
      cvc: req.body.card.cvc,
      registerCard: "0",
    },

    buyer: {
      id: req.body.user.id,
      name: req.body.user.firstName,
      surname: req.body.user.lastName,
      gsmNumber: "+905350000000",
      email: req.body.user.email,
      identityNumber: "74300864791",
      lastLoginDate: req.body.user.signedIn,
      registrationDate: req.body.user.createdAt,
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    billingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    basketItems: req.body.basketItems,
  }; */

  /*   const result = await initializeThreeDSPayments(data); */
  /*  await CompletePayment(result); */
  /*   res.json(result); */
  res.json("success");
});

export default handler;