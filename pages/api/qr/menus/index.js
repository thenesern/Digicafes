import nc from "next-connect";
import QRMenu from "../../../../models/QRMenuModel";
import db from "../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const menus = await QRMenu.find();
  await db.disconnect();
  res.json({ menus });
});

export default handler;
