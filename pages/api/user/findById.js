import nc from "next-connect";
import db from "../../../utils/db";
import { isAuth } from "../../../utils/auth";
import User from "../../../models/UserModel";

const handler = nc();

handler.use(isAuth);

handler.post(async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ _id: req.body.id });
    await db.disconnect();
    res.send({
      status: "success",
      user,
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
