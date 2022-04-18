import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.patch(async (req, res) => {
  try {
    await db.connect();
    let updatedOrder;
    if (req.body.orderProduct === "Dijital Menü - V1") {
      updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
        menuv1: req.body.menuId,
      });
    } else {
      updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
        menuv2: req.body.menuId,
      });
    }
    await db.disconnect();
    res.send({
      status: "success",
      message: "order successfuly updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);
  }
});
export default handler;
