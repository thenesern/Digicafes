import React from "react";
import Nav from "../../../../../components/Nav/Nav";
import UserDashboard from "../../../../../components/UserDashboard/UserDashboard";
import Order from "../../../../../models/OrderModel";
import Product from "../../../../../models/ProductModel";
import QRMenu from "../../../../../models/QRMenuModel";
import User from "../../../../../models/UserModel";
import db from "../../../../../utils/db";

const DashboardMenuv1 = ({ userOrder }) => {
  return (
    <div>
      <Nav />
      <UserDashboard order={userOrder} />
    </div>
  );
};

/* export async function getStaticPaths() {
  await db.connect();
  const orders = await Order.find();
  await db.disconnect();
  return {
    paths: orders.map((order) => {
      return {
        params: {
          userId: order.user.toString(),
          orderId: JSON.parse(JSON.stringify(order._id)),
        },
      };
    }),
    fallback: false, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const order = await Order.find({ _id: params.orderId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User })
    .populate({ path: "menuv1", model: QRMenu });
  await db.disconnect();
  return {
    props: {
      userOrder: JSON.parse(JSON.stringify(order)),
    },
  };
}
 */

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  await db.connect();
  const order = await Order.find({ _id: orderId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User })
    .populate({ path: "menuv1", model: QRMenu });
  await db.disconnect();
  return {
    props: {
      userOrder: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default DashboardMenuv1;
