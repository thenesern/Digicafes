import React from "react";
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
import db from "../../utils/db";
import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";
import User from "../../models/UserModel";
import { useEffect } from "react";
import Router from "next/router";
import Cookies from "js-cookie";

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
