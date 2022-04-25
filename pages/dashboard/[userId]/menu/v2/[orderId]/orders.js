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

const StoreOrderPanel = ({ data, order }) => {
  const [storeLogo, setStoreLogo] = useState(data?.storeLogo);
  const [storeName, setStoreName] = useState(data?.storeName);
  const [menuv2Id, setMenuv2Id] = useState(order?.menuv2);
  const [orders, setOrders] = useState(data?.orders);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    retrieveData().finally(() => {
      setTimeout(() => setRefreshToken(Math.random()), 15000);
    });
  }, [refreshToken]);

  async function retrieveData() {
    try {
      const menus = await axios.post(`/api/qr/v2/${storeName}/orders`, {
        menuv2Id,
      });
      if (orders.length < menus?.data?.menu?.orders.length) {
        setIsNew(true);
      }
      setOrders(menus?.data?.menu?.orders);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (isNew) {
      enqueueSnackbar("Yeni Sipariş", { variant: "success" });
      setIsNew(false);
    } else {
      return;
    }
  }, [isNew]);
  return (
    <div className={styles.container}>
      <OrderNav orders={orders} storeLogo={storeLogo} />
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
  console.log(order);
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
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default StoreOrderPanel;
