import nc from "next-connect";
import nanoid from "../../../../utils/nanoid.js";
import Iyzipay from "iyzipay";
import { initializePayment } from "../../../../services/iyzico/methods/threeds-payments.js";
const handler = nc();

handler.post(async (req, res) => {
  const result = await initializePayment({
    locale: Iyzipay.LOCALE.TR,
    callbackUrl: `https://www.digicafes.com/checkout/${req.body.order.id}/lobby`,
    conversationId: nanoid(),
    price: req.body.product.price,
    paidPrice: req.body.product.paidPrice,
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
      gsmNumber: req.body.user.phoneNumber,
      email: req.body.user.email,
      identityNumber: req.body.user.identityNumber,
      lastLoginDate: req.body.lastLoginDate,
      registrationDate: req.body.registrationDate,
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
  });

  res.json(result);
  res.json(res);
});

export default handler;
