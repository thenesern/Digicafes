import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

export default handler;
