import nc from "next-connect";
import QRMenu from "../../../../models/QRMenuModel";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const menus = await QRMenu.find();
  await db.disconnect();
  res.json({ menus });
});

export default handler;
