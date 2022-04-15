import nc from "next-connect";
import QRMenu from "../../../../../models/QRMenuModel";
import db from "../../../../../utils/db";

const handler = nc();

handler.patch(async (req, res) => {
  await db.connect();
  console.log(req.body)
  const prev = await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      categories: req.body.categories,
    }
  );
  const menu = await QRMenu.findOne({ storeName: req.body.storeName });
  res.json({ status: "success", menu });
  await db.disconnect();
});

export default handler;
