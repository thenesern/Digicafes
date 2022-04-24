import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Nav from "../../../../../../components/Nav/Nav";
import OrderNav from "../../../../../../components/OrderNav/OrderNav";
import StoreOrders from "../../../../../../components/StoreOrders/StoreOrders";
import Order from "../../../../../../models/OrderModel";
import QRMenu from "../../../../../../models/QRMenu2Model";
import db from "../../../../../../utils/db";
import styles from "./orders.module.css";

const StoreOrderPanel = ({ data }) => {
  const [orders, setOrders] = useState(data?.orders);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const [storeName, setStoreName] = useState(data?.storeName);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    retrieveData().finally(() => {
      // Update refreshToken after 3 seconds so this event will re-trigger and update the data
      setTimeout(() => setRefreshToken(Math.random()), 15000);
    });
  }, [refreshToken]);

  async function retrieveData() {
    const menus = await axios.get(
      "http://localhost:3000/api/qr/v2/demo/orders"
    );

    if (
      orders.map((o) => o._id)[0] !==
      menus?.data?.menus
        ?.filter((menu) => menu.storeName === storeName)[0]
        .orders.map((o) => o._id)[0]
    ) {
      console.log("change detected");
      setIsNew(true);
    }
    return setOrders(
      menus?.data?.menus?.filter((menu) => menu.storeName === storeName)[0]
        .orders
    );
  }
  useEffect(() => {
    if (isNew) {
      enqueueSnackbar("Yeni Sipariş", { variant: "success" });
      setIsNew(false);
    } else {
      return;
    }
  }, [isNew, enqueueSnackbar]);
  return (
    <div className={styles.container}>
      <OrderNav orders={orders} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <StoreOrders orders={orders} />
    </div>
  );
};

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const { userId } = context.query;
  const signedUserId = JSON.parse(context.req.cookies["userInfo"])?.id || null;
  await db.connect();

  const order = await Order.findOne({ _id: orderId });
  const menu = await QRMenu.findOne({ _id: order?.menuv2 });
  await db.disconnect();

  if (signedUserId !== userId) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: JSON.parse(JSON.stringify(menu)),
    },
  };
}
export default StoreOrderPanel;
