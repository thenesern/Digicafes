import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu1Model";
import { isAuth } from "../../../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      gallery: req.body.gallery,
    }
  );
  const menu = await QRMenu.findOne({ storeName: req.body.storeName });
  const gallery = menu?.gallery;
  res.json({ status: "success", gallery });
  await db.disconnect();
});

export default handler;
