import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
import QRMenu1 from "../../../models/QRMenu1Model";
import QRMenu2 from "../../../models/QRMenu2Model";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  try {
    const newOrder = new Order({
      product: req.body.product,
      user: req.body.user,
      createdAt: new Date().toLocaleString("tr-TR"),
    });
    await newOrder.save();
    await db.disconnect();
    res.send({
      status: "success",
      message: "Order saved successfully",
      id: newOrder._id,
    });
  } catch (err) {
    console.log(err.message);
    await db.disconnect();
  }
});

/* handler.patch(async (req, res) => {
  try {
    await db.connect();
    const product = await Product.findById();
    console.log(req.body);
      const updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
      menuv1: req.body.menuId,
    }).populate({
      path: "menuv1",
      model: QRMenu,
    });
 
    await db.disconnect();
    res.send({
      status: "success",
      message: "order successfuly updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);
  }
}); */

export default handler;
