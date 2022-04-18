import nc from "next-connect";
import db from "../../../../utils/db";
import QRMenu from "../../../../models/QRMenu2Model";
import { isAuth } from "../../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const newMenu = new QRMenu({
    storeName: req.body.storeName,
    createdAt: req.body.createdAt,
    categories: req.body.categories,
    owner: req.body.owner,
  });
  const menu = await newMenu.save();
  await db.disconnect();
  res.json({ status: "succes", message: "Menu created successfully", menu });
});

export default handler;
