import moment from "moment";
import { createAPayment } from "../../services/iyzico/methods/payment.js";
import { CompletePayment } from "../../utils/payments.js";
import nc from "next-connect";
import db from "../../utils/db";
import Iyzipay from "iyzipay";
const handler = nc();
handler.post(async (req, res) => {
  if (!req.body?.paymentId) {
    console.log(err.message);
  }
  if (req.body.status !== "success") {
    console.log(err.message);
  }
  const data = {
    locale: "tr",
    conversationId: nanoid(),
    paymentId: req.body.paymentId,
    conversationData: req.body.conversationData,
  };
  const result = await completeThreeDSPayment(data);
  res.json( result );
});

export default handler;
