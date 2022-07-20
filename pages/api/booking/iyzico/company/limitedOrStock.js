import nc from "next-connect";
import Iyzipay from "iyzipay";
import { createCompany } from "../../../../../services/iyzico/methods/company";
const handler = nc();

handler.post(async (req, res) => {
  const result = await createCompany({
    locale: Iyzipay.LOCALE.TR,
    conversationId: req.body.orderId,
    name: req.body.storeName,
    gsmNumber: req.body.gsmNumber,
    taxOffice: req.body.taxOffice,
    taxNumber: req.body.taxNumber,
    legalCompanyTitle: req.body.legalCompanyTitle,
    email: req.body.email,
    address: req.body.address,
    iban: req.body.IBAN,
    identityNumber: req.body.identityNumber,
    subMerchantType: Iyzipay.SUB_MERCHANT_TYPE.LIMITED_OR_JOINT_STOCK_COMPANY,
    subMerchantExternalId: req.body.orderId,
    currency: Iyzipay.CURRENCY.TRY,
  });

  res.json(result);
});

export default handler;
