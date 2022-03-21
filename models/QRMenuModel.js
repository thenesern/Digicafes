import mongoose from "mongoose";

const QRMenuSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const QRMenu = mongoose.models.QRMenu || mongoose.model("QRMenu", QRMenuSchema);

export default QRMenu;
