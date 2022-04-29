import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";

const handler = nc();

handler.use(isAuth);
handler.post(async (req, res) => {
  try {
    await db.connect();
    console.log(req.body);
    const order = await Order.find({ user: req.body.user })
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User });
    await db.disconnect();
    console.log(order);
    res.send({ status: "success", order });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
