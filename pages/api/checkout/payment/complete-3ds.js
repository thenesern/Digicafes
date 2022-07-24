import nc from "next-connect";
import Iyzipay from "iyzipay";
const handler = nc();
import { completePayment } from "../../../../services/iyzico/methods/threeds-payments.js";

handler.post(async (req, res) => {
  const result = await completePayment({
    conversationId: req.body.conversationId,
    locale: Iyzipay.LOCALE.TR,
    paymentId: req.body.paymentId,
    conversationData: req.body.conversationData,
  });

  res.json(result);
});

export default handler;
