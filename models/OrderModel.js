import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    quantity: [{ type: Number, required: true }],
    menuv1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRMenu1",
    },
    menuv2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRMenu2",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    } /*
    price: {
      type: Number,
      required: true,
    },
    paidPrice: {
      type: Number,
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    log: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    }, */,
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
