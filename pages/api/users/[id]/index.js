import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ status: "success", message: "User removed successfully" });
  } else {
    await db.disconnect();
    res.send({ status: "error", message: "User Not Found" });
  }
});

export default handler;
