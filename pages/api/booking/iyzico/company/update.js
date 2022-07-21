import nc from "next-connect";
import Iyzipay from "iyzipay";
import { updateCompany } from "../../../../../services/iyzico/methods/company/update";
const handler = nc();

handler.post(async (req, res) => {
  const result = await updateCompany({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.conversationId,
    subMerchantKey: req.body.subMerchantKey,
    address: req.body.address,
    taxOffice: req.body.taxOffice,
    legalCompanyTitle: req.body.legalCompanyTitle,
    email: req.body.email,
    gsmNumber: req.body.gsmNumber,
    name: req.body.storeName,
    iban: req.body.iban,
    identityNumber: req.body.identityNumber,
    currency: Iyzipay.CURRENCY.TRY,
  });
  res.json(result);
});

export default handler;
