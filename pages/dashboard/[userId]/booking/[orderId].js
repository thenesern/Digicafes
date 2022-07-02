import React from "react";
import Nav2 from "../../../../components/Nav2/Nav";
import styles from "./booking.module.css";
import Order from "../../../../models/OrderModel";
import Product from "../../../../models/ProductModel";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
import BookingModel from "../../../../models/Booking";
import Cookies from "js-cookie";

const Booking = () => {
  return (
    <div className={styles.container}>
      <Nav2 />
      <div className={styles.wrapper}>
        <div className={styles.sideBar}></div>
        <div className={styles.app}></div>
      </div>
    </div>
  );
};
export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const { userId } = context.query;
  const signedUserId = JSON.parse(context.req.cookies["userInfo"])?.id || null;
  if (signedUserId !== userId) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  await db.connect();
  const order = await Order.find({ _id: orderId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User })
    .populate({ path: "booking", model: BookingModel });

  const newDate = new Date();
  if (
    new Date(order[0]?.expiry?.toString()).getTime() > newDate.getTime() ===
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
      userOrder: JSON.parse(JSON.stringify(order)),
      userId,
    },
  };
}

export default Booking;
