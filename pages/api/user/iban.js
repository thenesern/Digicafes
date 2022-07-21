import nextConnect from "next-connect";
import User from "../../../models/UserModel";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nextConnect();

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      IBAN: req.body.iban,
    }
  );
  res.json({ status: "success" });
  await db.disconnect();
});

export default handler;
