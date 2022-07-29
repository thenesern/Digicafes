import nc from "next-connect";
import Booking from "../../../models/Booking";
import db from "../../../utils/db";

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const store = await Booking.findByIdAndUpdate(req.body.id, {
      bookings: req.body.bookings,
    });
    await db.disconnect();
    res.json({
      status: "success",
      store,
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
