import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu1Model";
import { isAuth } from "../../../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      currency: req.body.currency,
    }
  );
  const menu = await QRMenu.findOne({ storeName: req.body.storeName });
  const currency = menu?.currency;
  res.json({ status: "success", currency });
  await db.disconnect();
});

export default handler;
