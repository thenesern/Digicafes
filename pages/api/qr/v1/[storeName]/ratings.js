import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu1Model";

const handler = nc();

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      $push: {
        ratings: req.body.ratings,
      },
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
