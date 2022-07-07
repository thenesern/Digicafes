import nc from "next-connect";
import Booking from "../../../../models/Booking";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth);

handler.patch(async (req, res) => {
  await db.connect();
  await Booking.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      gallery: req.body.gallery,
    }
  );
  const store = await Booking.findOne({ storeName: req.body.storeName });
  const gallery = store?.gallery;
  res.json({ status: "success", gallery });
  await db.disconnect();
});

export default handler;
