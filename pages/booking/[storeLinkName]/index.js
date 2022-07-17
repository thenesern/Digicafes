import React from "react";
import Booking from "../../../models/Booking";
import Order from "../../../models/OrderModel.js";
import db from "../../../utils/db";
import Nav from "../../../components/Nav2/Nav";
import Footer from "../../../components/Footer/Footer";
import StoreBookingShowcase from "../../../components/Booking/BookingShowcase/index";

const StoreBookingProfile = ({ store }) => {
  console.log(store);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Nav color={store?.navbar?.color} />
      <StoreBookingShowcase store={store} />
      <Footer />
    </div>
  );
};
export async function getServerSideProps(context) {
  const { storeLinkName } = context.query;
  console.log(storeLinkName);
  await db.connect();
  const store = await Booking.findOne({
    storeLinkName,
  });

  const order = await Order.findOne({ booking: store?._id });
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
      store: JSON.parse(JSON.stringify(store)),
    },
  };
}
export default StoreBookingProfile;
