import nc from "next-connect";
import db from "../../utils/db";
import Product from "../../models/ProductModel";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      period: req.body.period,
      category: req.body.category,
    });
    await newProduct.save();
    await db.disconnect();
    res.send({ status: "succes", message: "Product saved successfully" });
  } catch (err) {
    console.log(err.message);
    await db.disconnect();
  }
});

export default handler;
