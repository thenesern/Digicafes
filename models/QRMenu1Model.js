import mongoose from "mongoose";

const QRMenuSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
    },
    storeLinkName: {
      type: String,
      required: true,
      unique: true,
    },
    storeLogo: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
        category: [
          {
            type: String,
            required: true,
          },
        ],
        image: {
          type: String,
          required: false,
        },
      },
    ],
    categories: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: false,
        },
      },
    ],
    createdAt: {
      type: String,
    },
  },
  { timestamps: true }
);

const QRMenu1 =
  mongoose.models.QRMenu1 || mongoose.model("QRMenu1", QRMenuSchema);

export default QRMenu1;
