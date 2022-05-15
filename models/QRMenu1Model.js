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
    listType: {
      type: String,
      required: true,
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
          required: false,
        },
        category: [
          {
            type: String,
            required: true,
          },
        ],
        subCategory: {
          type: String,
          unique: true,
        },
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
          required: true,
        },
        order: {
          type: Number,
          unique: true,
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
