import nc from "next-connect";
import Booking from "../../../../models/Booking";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth);
handler.post(async (req, res) => {
  await db.connect();
  await Booking.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      $push: { bookings: req.body.bookings },
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
