import nc from "next-connect";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";
import Order from "../../../models/OrderModel";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    signedIn: req.body.signedIn,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    isAdmin: false,
    createdAt: req.body.createdAt,
  });
  const user = await newUser.save();

  const token = signToken(user);

  let date = new Date();
  date.setDate(date.getDate() + 14);

  const newOrder = new Order({
    product: "625d3a6821c87548216f71e0",
    user: user?._id,
    createdAt: req.body.createdAt,
    expiry: date,
    quantity: req.body.quantity,
  });
  await newOrder.save();
  const newOrder2 = new Order({
    product: "6258375f9e1d43dfdd2eb688",
    user: user?._id,
    createdAt: req.body.createdAt,
    expiry: date,
    quantity: req.body.quantity,
  });
  await newOrder2.save();

  const newOrder3 = new Order({
    product: "62bf17d63c33439aac11b362",
    user: user?._id,
    createdAt: req.body.createdAt,
    expiry: date,
    quantity: req.body.quantity,
  });
  await newOrder3.save();
  await db.disconnect();

  res.send({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
    token,
    isAdmin: user.isAdmin,
  });
});

export default handler;
