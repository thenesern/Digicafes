import nc from "next-connect";
import Booking from "../../../models/Booking";
import db from "../../../utils/db";

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    const store = await Booking.findByIdAndUpdate(req.body.id, {
      payments: req.body.payments,
    });
    await db.disconnect();
    res.send({
      status: "success",
      store,
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
