import nc from "next-connect";
import Booking from "../../../../models/Booking";
import User from "../../../../models/UserModel";
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

  await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $push: { bookings: req.body.bookings },
    }
  );

  await db.disconnect();

  res.json({ status: "success" });
});

export default handler;
