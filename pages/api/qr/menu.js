import nc from "next-connect";
import QRMenu from "../../../models/QRMenuModel";
import db from "../../../utils/db";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newMenu = new QRMenu({
    storeName: req.body.storeName,
  });
  const menu = await newMenu.save();
  await db.disconnect();
});

export default handler;
