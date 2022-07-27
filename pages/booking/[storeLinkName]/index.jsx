import React from "react";
import Booking from "../../../models/Booking";
import Order from "../../../models/OrderModel.js";
import db from "../../../utils/db";
import Nav from "../../../components/Nav/Nav";
import Footer from "../../../components/Footer/Footer";
import StoreBookingShowcase from "../../../components/Booking/BookingShowcase/index";
import User from "../../../models/UserModel";

const StoreBookingProfile = ({ order }) => {
  const color = order?.booking?.navbar?.color
    ? store?.navbar?.color
    : "#c9184a";

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Nav color={color} />
      <StoreBookingShowcase order={order} />
      <Footer />
    </div>
  );
};
export async function getServerSideProps(context) {
  const { storeLinkName } = context.query;
  await db.connect();
  const store = await Booking.findOne({
    storeLinkName,
  });

  const order = await Order.findOne({ booking: store?._id })
    .populate({
      path: "booking",
      model: Booking,
    })
    .populate({ path: "user", model: User });
  const newDate = new Date();
  if (
    new Date(order?.expiry?.toString()).getTime() > newDate.getTime() ===
    false
  ) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  await db.disconnect();
  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default StoreBookingProfile;
