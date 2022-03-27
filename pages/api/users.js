import nc from "next-connect";
import User from "../../models/UserModel.js";
import db from "../../utils/db.js";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find();
  console.log(users);
  await db.disconnect();
  res.json(users);
});

export default handler;
