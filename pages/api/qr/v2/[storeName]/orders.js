import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu2Model";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const menu = await QRMenu.findOne({ _id: req.body.menuv2Id });
  res.send({ status: "success", menu });
  await db.disconnect();
});

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      $push: { orders: req.body.orders },
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
