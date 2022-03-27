import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const Products =
  mongoose.models.Products || mongoose.model("Products", productsSchema);

export default Products;
