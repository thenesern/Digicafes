import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu2Model";

const handler = nc();

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      $push: { calls: req.body.calls },
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
