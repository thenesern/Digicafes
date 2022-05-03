import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import QRMenu2 from "../../../models/QRMenu2Model";
import QRMenu1 from "../../../models/QRMenu1Model";

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
      updatedOrder = await Order.findOne({ menuv1: req.body.menuId }).populate({
        path: "menuv1",
        model: QRMenu1,
      });
    } else {
      updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
        menuv2: req.body.menuId,
      });
      updatedOrder = await Order.findOne({ menuv2: req.body.menuId }).populate({
        path: "menuv2",
        model: QRMenu2,
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
