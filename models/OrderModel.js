import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    payments: [],
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
