import nc from "next-connect";
import { isAdmin, isAuth, signToken } from "../../../../utils/auth";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";

const handler = nc();

/* handler.use(isAuth); */

handler.patch(async (req, res) => {
  await db.connect();
  const user = await User.findByIdAndUpdate(req.body.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  await db.disconnect();
  const token = signToken(user);
  res.send({
    token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
    isAdmin: user.isAdmin,
    signedIn: user.signedIn,
  });
});
export default handler;
