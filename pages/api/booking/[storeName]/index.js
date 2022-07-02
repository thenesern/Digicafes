import nc from "next-connect";
import Booking from "../../../../models/Booking";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const bookings = await Booking.find();
  res.json({ status: "success", bookings });
});

handler.post(async (req, res) => {
  await db.connect();
  const newStore = new Booking({
    storeName: req.body.storeName,
    storeLinkName: req.body.storeLinkName,
    tableNum: req.body.tableNum,
    createdAt: req.body.createdAt,
    owner: req.body.owner,
  });
  const store = await newStore.save();
  await db.disconnect();
  res.json({ status: "succes", message: "Store created successfully", store });
});

handler.patch(async (req, res) => {
  await db.connect();
  await Booking.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      storeLogo: req.body.storeLogo,
    }
  );
  const store = await Booking.findOne({ storeName: req.body.storeName });
  res.json({ status: "success", store });
  await db.disconnect();
});

export default handler;
