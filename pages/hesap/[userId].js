import React from "react";
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
import db from "../../utils/db";
import User from "../../models/UserModel";
import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";

const Hesap = ({ order }) => {
  return (
    <>
      <Nav />
      <div>
        <UserProfile order={order} />
      </div>
    </>
  );
};

export async function getStaticPaths() {
  await db.connect();
  const users = await User.find();
  await db.disconnect();
  return {
    paths: users.map((user) => {
      return {
        params: { userId: JSON.parse(JSON.stringify(user._id)) },
      };
    }),
    fallback: true, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const order = await Order.find({ user: params.userId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User });
  await db.disconnect();
  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default Hesap;
