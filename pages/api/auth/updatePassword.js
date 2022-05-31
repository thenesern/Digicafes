import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const defined = undefined;
  const newPassword = await bcrypt.hash(req.body.password, 12);
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        password: newPassword,
        passwordResetToken: defined,
        passwordResetExpires: defined,
      }
    ).select("+password");
    user.save();
    await db.disconnect();
    res.send({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    await db.disconnect();
    res.send({
      status: "fail",
    });
  }
});

export default handler;
