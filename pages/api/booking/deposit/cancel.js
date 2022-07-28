import nc from "next-connect";
import Iyzipay from "iyzipay";
import { cancelDeposit } from "../../../../services/iyzico/methods/deposit/cancel";
const handler = nc();

handler.post(async (req, res) => {
  const result = await cancelDeposit({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.conversationId,
    paymentTransactionId: req.body.paymentTransactionId,
  });
  res.send(result);
});

export default handler;
