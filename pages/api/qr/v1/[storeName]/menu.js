import nc from "next-connect";
import db from "../../../../../utils/db";
import QRMenu from "../../../../../models/QRMenu1Model";
import { isAuth } from "../../../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const menusv1 = await QRMenu.find();
  res.json({ status: "success", menusv1 });
});

handler.post(async (req, res) => {
  await db.connect();
  const newMenu = new QRMenu({
    storeName: req.body.storeName,
    storeLinkName: req.body.storeLinkName,
    createdAt: req.body.createdAt,
    categories: req.body.categories,
    address: req.body.address,
    owner: req.body.owner,
    listType: req.body.listType,
    subCategory: req.body.subCategory,
  });
  const menu = await newMenu.save();
  await db.disconnect();
  res.json({ status: "succes", message: "Menu created successfully", menu });
});

handler.patch(async (req, res) => {
  await db.connect();
  await QRMenu.findOneAndUpdate(
    { storeName: req.body.storeName },
    {
      products: req.body.products,
      storeLogo: req.body.storeLogo,
    }
  );
  const menu = await QRMenu.findOne({ storeName: req.body.storeName });
  res.json({ status: "success", menu });
  await db.disconnect();
});

export default handler;
