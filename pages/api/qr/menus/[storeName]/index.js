import nc from "next-connect";
import QRMenu from "../../../../../models/QRMenuModel";
import db from "../../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const name = req.query.storeName;
  try {
    const menu = await QRMenu.find({ storeName: `${name}` });
    res.json({ menu });
  } catch (err) {
    console.log(err.message);
  }
  await db.disconnect();
});

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      products: req.body.products,
    }
  );
  const menu = await QRMenu.findOne({ storeName: req.body.storeName });
  res.json({ status: "success", menu });
  await db.disconnect();
});

export default handler;
