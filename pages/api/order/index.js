import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
import QRMenu from "../../../models/QRMenuModel";

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

handler.get(async (req, res) => {
  try {
    await db.connect();
    const order = await Order.find({ user: req.body.user })
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User });
    /* const order = await Order.findById(req.body.order)
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User }); */
    await db.disconnect();
    res.send(order);
  } catch (err) {
    console.log(err);
  }
});
handler.patch(async (req, res) => {
  try {
    await db.connect();
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
});

export default handler;
