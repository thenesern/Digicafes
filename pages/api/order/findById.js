import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import { isAuth } from "../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  try {
    await db.connect();
    const order = await Order.findOne({ _id: req.body.id });
    res.send({
      status: "success",
      order,
    });
    await db.disconnect();
  } catch (err) {
    console.log(err);
  }
});

export default handler;
