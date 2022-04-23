import mongoose from "mongoose";

const QRMenuSchema = new mongoose.Schema(
  {
    storeName: {
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
    orders: [
      {
        tableNum: Number,
        cartItems: [
          {
            name: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            img: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const QRMenu2 =
  mongoose.models.QRMenu2 || mongoose.model("QRMenu2", QRMenuSchema);

export default QRMenu2;
