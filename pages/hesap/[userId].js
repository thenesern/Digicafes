import React from "react";
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
import db from "../../utils/db";
import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";
import User from "../../models/UserModel";

const Hesap = ({ orders }) => {
  return (
    <>
      <Nav />
      <div>
        <UserProfile orders={orders} />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.query;
  await db.connect();
  const order = await Order.find({ user: userId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User });
  await db.disconnect();
  return {
    props: {
      orders: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default Hesap;
