import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import Booking from "../../../models/Booking";

const handler = nc();

handler.use(isAuth);

handler.patch(async (req, res) => {
  console.log(req.body);
  try {
    await db.connect();
    let updatedOrder;
    if (req.body.orderProduct === "Booking") {
      updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
        booking: req.body.bookingId,
      });
      updatedOrder = await Order.findOne({
        booking: req.body.bookingId,
      }).populate({
        path: "booking",
        model: Booking,
      });
    }
    await db.disconnect();
    res.send({
      status: "success",
      message: "Order successfuly updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);
  }
});
export default handler;
