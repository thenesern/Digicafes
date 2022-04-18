import nc from "next-connect";
import QRMenu from "../../../../../models/QRMenu1Model";
import { isAuth } from "../../../../../utils/auth";
import db from "../../../../../utils/db";

const handler = nc();

handler.use(isAuth);

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

export default handler;
