import nc from "next-connect";
import Iyzipay from "iyzipay";
import { confirmDeposit } from "../../../../services/iyzico/methods/deposit/confirm";
const handler = nc();

handler.post(async (req, res) => {
  const result = await confirmDeposit({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.conversationId,
    paymentTransactionId: req.body.paymentTransactionId,
  });
  res.send(result);
});

export default handler;
