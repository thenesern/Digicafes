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
  try {
    console.log(req.body);
    await db.connect();
    const order = await Order.find({ user: req.body.user })
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User })
      .populate({ path: "menuv1", model: QRMenu1 })
      .populate({ path: "menuv2", model: QRMenu2 });
    await db.disconnect();
    res.send({ status: "success", order });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
