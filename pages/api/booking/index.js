import nc from "next-connect";
import Booking from "../../../models/Booking";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const bookings = await Booking.find();
  res.json({ status: "success", bookings });
});

export default handler;
