import nc from "next-connect";
import Booking from "../../../models/Booking";
import db from "../../../utils/db";

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    await Booking.findByIdAndUpdate(req.body.id, {
      $push: {
        payments: {
          payment: req.body.payment,
        },
      },
    });
    await db.disconnect();
    res.send({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
