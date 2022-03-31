import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  try {
    const newOrder = new Order({
      product: req.body.product,
      user: req.body.user,
    });
    await newOrder.save();
    await db.disconnect();
    res.send({
      status: "succes",
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
    const order = await Order.findById(req.body.order)
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User });
    await db.disconnect();
    res.send(order);
  } catch (err) {
    console.log(err);
  }
});

export default handler;
