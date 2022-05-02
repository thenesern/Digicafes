import nc from "next-connect";
import Order from "../../../../models/OrderModel";
import Product from "../../../../models/ProductModel";
import QRMenu1 from "../../../../models/QRMenu1Model";
import QRMenu2 from "../../../../models/QRMenu2Model";
import User from "../../../../models/UserModel";
import { isAdmin, isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    await order.remove();
    const orders = await Order.find()
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User })
      .populate({ path: "menuv1", model: QRMenu1 })
      .populate({ path: "menuv2", model: QRMenu2 });
    res.send({
      status: "success",
      message: "Order removed successfully",
      orders,
    });
    await db.disconnect();
  } else {
    await db.disconnect();
    res.send({ status: "error", message: "Order Not Found" });
  }
});

export default handler;
