import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu2Model";

const handler = nc();

handler.patch(async (req, res) => {
  console.log(req.body);
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
