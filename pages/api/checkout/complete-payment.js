import moment from "moment";
import { createAPayment } from "../../../services/iyzico/methods/payment.js";
import { CompletePayment } from "../../../utils/payments.js";
import nc from "next-connect";
const handler = nc();
handler.post(async (req, res) => {
  let result = await getFormPayment({
    conversationId: nanodid(),
    token: req.body.token,
  });
  await CompletePayment(result);
  res.json(result);
});

export default handler;
