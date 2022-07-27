import nc from "next-connect";
import Iyzipay from "iyzipay";
import { initializePayment } from "../../../../../services/iyzico/methods/threeds-payments.js";
import nanoid from "../../../../../utils/nanoid.js";
const handler = nc();

handler.post(async (req, res) => {
  const result = await initializePayment({
    locale: Iyzipay.LOCALE.TR,
    callbackUrl: `https://www.digicafes.com/checkout/${req.body.order.id}/lobby/${req.body.user.id}`,
    conversationId: nanoid(),
    price: req.body.product.price,
    paidPrice: req.body.product.paidPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: nanoid(),
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
      gsmNumber: req.body.user.phoneNumber,
      email: req.body.user.email,
      identityNumber: req.body.user.identityNumber,
      lastLoginDate: req.body.lastLoginDate,
      registrationDate: req.body.registrationDate,
      registrationAddress: "No Data",
      ip: req.body.user.ip,
      city: "No Data",
      country: "Turkey",
      zipCode: "No Data",
    },
    billingAddress: {
      contactName: req.body.user.firstName + " " + req.body.user.lastName,
      city: "Istanbul",
      country: "Turkey",
      address: "No Data",
      zipCode: "No Data",
    },
    basketItems: req.body.basketItems,
  });

  res.send(result);
});

export default handler;
