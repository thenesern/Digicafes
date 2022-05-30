import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import Nav2 from "../../../../../components/Nav2/Nav";
import UserDashboard from "../../../../../components/UserDashboard/UserDashboard";
import Order from "../../../../../models/OrderModel";
import Product from "../../../../../models/ProductModel";
import QRMenu from "../../../../../models/QRMenu1Model";
import User from "../../../../../models/UserModel";
import db from "../../../../../utils/db";
const DashboardMenuv1 = ({ userOrder }) => {
  return (
    <div>
      <Nav2 />
      <UserDashboard userOrder={userOrder} />
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
    .populate({ path: "menuv1", model: QRMenu });

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
export default DashboardMenuv1;
