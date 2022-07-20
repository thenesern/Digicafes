import nc from "next-connect";
import Iyzipay from "iyzipay";
import { getCompany } from "../../../../../services/iyzico/methods/company/get";
const handler = nc();

handler.post(async (req, res) => {
  const result = await getCompany({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.conversationId,
    subMerchantExternalId: req.body.subMerchantExternalId,
  });

  res.json(result);
});

export default handler;
