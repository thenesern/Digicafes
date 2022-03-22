import nc from "next-connect";
import QRMenu from "../../../../models/QRMenuModel";
import db from "../../../../utils/db";

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
  const name = req.body.storeName;
  const menu = await QRMenu.find({ storeName: `${name}` });
  if (menu) {
    const updatedMenu = await QRMenu.updateOne({ products: req.body.products });
    res.json("Updated successfully", updatedMenu);
    await db.disconnect();
  }
});

export default handler;
