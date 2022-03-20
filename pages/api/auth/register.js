import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

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
  });
  const user = await newUser.save();
  await db.disconnect();
  console.log(user);
  const token = signToken(user);
  res.send({
    firstName: user.firstName,
    lastName: user.lastName,
    signedIn: user.signedIn,
    email: user.email,
    id: user._id,
    isAdmin: user.isAdmin,
    token,
  });
});

export default handler;
