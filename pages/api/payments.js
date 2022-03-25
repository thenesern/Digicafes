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
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installments: "1",
    /*   basketId: String(order?._id), */
    basketId: "11111",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    paymentCard: req.card,
    buyer: {
      /*   id: String(req.user.id), */
      id: "21312",
      name: req.user?.name,
      surname: req.user?.surname,
      gsmNumber: req.user?.phoneNumber,
      email: req.user?.email,
      identityNumber: req.user?.identityNumber,
      lastLoginDate: req.user?.signedIn,
      registrationDate: req.user?.createdAt,
      registrationAddress: req.user?.address,
      ip: req.user?.ip,
      city: req.user?.city,
      country: req.user?.country,
      zipCode: req.user?.zipCode,
    },
    /*    basketItems: cart.products.map((product, index) => {
      return {
        id: String(product?._id),
        name: product?.name,
        category1: product?.category,
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: product?.price,
      };
    }), */
    basketItems: {
      id: "123",
      name: "asd",
      category1: "aaa",
      itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
      price: "300",
    },
  };
  const result = await createAPayment(data);
  await CompletePayment(result);
  res.json(result);
});

export default handler;
