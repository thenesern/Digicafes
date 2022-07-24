import nc from "next-connect";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
import QRMenu1 from "../../../models/QRMenu1Model";
import QRMenu2 from "../../../models/QRMenu2Model";
import Booking from "../../../models/Booking";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  try {
    const newOrder = new Order({
      product: req.body.product,
      user: req.body.user,
      createdAt: new Date(),
      expiry: req.body.expiry,
      quantity: req.body.quantity,
    });

    await newOrder.save();
    const orders = await Order.find()
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User })
      .populate({ path: "menuv1", model: QRMenu1 })
      .populate({ path: "menuv2", model: QRMenu2 })
      .populate({ path: "booking", model: Booking });
    res.send({
      status: "success",
      message: "Order saved successfully",
      id: newOrder._id,
      orders,
    });
    await db.disconnect();
  } catch (err) {
    console.log(err.message);
    await db.disconnect();
  }
});

handler.patch(async (req, res) => {
  try {
    await db.connect();
    if (req.body.payment) {
      await Order.findByIdAndUpdate(req.body.id, {
        expiry: req.body.expiry,
        $push: { quantity: req.body.quantity },
        $push: { payments: req.body.payment },
      });
    }
    if (!req.body.payment) {
      await Order.findByIdAndUpdate(req.body.id, {
        expiry: req.body.expiry,
        $push: { quantity: req.body.quantity },
      });
    }
    const orders = await Order.find()
      .populate({
        path: "product",
        model: Product,
      })
      .populate({ path: "user", model: User })
      .populate({ path: "menuv1", model: QRMenu1 })
      .populate({ path: "menuv2", model: QRMenu2 })
      .populate({ path: "booking", model: Booking });
    await db.disconnect();
    res.send({
      status: "success",
      message: "order successfuly updated",
      orders,
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
