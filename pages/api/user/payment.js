import nc from "next-connect";
import db from "../../../utils/db";
import User from "../../../models/UserModel";

const handler = nc();

handler.patch(async (req, res) => {
  try {
    await db.connect();
    await User.findByIdAndUpdate(req.body.id, {
      $push: {
        payments: {
          payment: req.body.payment,
          storeName: req.body.storeName,
        },
      },
    });
    await db.disconnect();
    res.send({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

export default handler;
