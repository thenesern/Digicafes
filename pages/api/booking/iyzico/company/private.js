import nc from "next-connect";
import Iyzipay from "iyzipay";
import { createCompany } from "../../../../../services/iyzico/methods/company";
const handler = nc();

handler.post(async (req, res) => {
  const result = await createCompany({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.orderId,
    subMerchantExternalId: req.body.orderId,
    subMerchantType: Iyzipay.SUB_MERCHANT_TYPE.PRIVATE_COMPANY,
    address: req.body.address,
    taxNumber: req.body.taxNumber,
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
