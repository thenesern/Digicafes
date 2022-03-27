import nc from "next-connect";
import { isAdmin, isAuth } from "../../../utils/auth";
import Product from "../../../models/ProductModel";
import db from "../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ status: "success", message: "Product removed successfully" });
  } else {
    await db.disconnect();
    res.send({ status: "error", message: "Product Not Found" });
  }
});

export default handler;
