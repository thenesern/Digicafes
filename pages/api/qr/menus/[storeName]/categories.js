import nc from "next-connect";
import QRMenu from "../../../../../models/QRMenuModel";
import db from "../../../../../utils/db";

const handler = nc();

handler.patch(async (req, res) => {
  console.log(req.body);
  await db.connect();
  const menu = await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      categories: req.body.categories,
    }
  );
  console.log(menu);
  res.json({ status: "success", menu });
  await db.disconnect();
});

export default handler;
