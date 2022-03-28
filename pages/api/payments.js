import moment from "moment";
import { createAPayment } from "../../services/iyzico/methods/payment.js";
import { CompletePayment } from "../../utils/payments.js";
import nc from "next-connect";
import db from "../../utils/db";
import nanoid from "../../utils/nanoid.js";
import Iyzipay from "iyzipay";
const handler = nc();

handler.post(async (req, res) => {
  const data = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.order.id,
    price: req.order.price,
    paidPrice: req.order.price,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: req.order.id,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    paymentCard: {
      cardHolderName: req.card.name,
      cardNumber: req.card.number,
      expireMonth: req.card.expireMonth,
      expireYear: req.card.expireYear,
      cvc: req.card.cvc,
      registerCard: "0",
    },
    buyer: {
      id: req.user.id,
      name: req.user.firstName,
      surname: req.user.lastName,
      gsmNumber: "+905350000000",
      email: req.user.email,
      identityNumber: "74300864791",
      lastLoginDate: req.user.signedIn,
      registrationDate: req.user.createdAt,
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
    basketItems: [
      {
        id: req._construct.id,
        name: req.product.name,
        category1: req.product.category,
        category2: "Digital Service",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: req.product.price,
      },
    ],
  };
  const result = await createAPayment(data);
  /*  await CompletePayment(result); */
  res.json(result);
});

export default handler;
