import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu2Model";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();

  const menus = await QRMenu.find();
  res.send({ status: "success", menus });
  await db.disconnect();
});

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      orders: req.body.orders,
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
