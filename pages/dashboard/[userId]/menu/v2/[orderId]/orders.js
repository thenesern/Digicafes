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
import ReactAudioPlayer from "react-audio-player";
import { useRef } from "react";
import useTranslation from "next-translate/useTranslation";

const StoreOrderPanel = ({ data, order }) => {
  const [storeLogo, setStoreLogo] = useState(data?.storeLogo);
  const [storeName, setStoreName] = useState(data?.storeName);
  const [menuv2Id, setMenuv2Id] = useState(order?.menuv2);
  const [orders, setOrders] = useState(data?.orders);
  const [calls, setCalls] = useState(data?.calls);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isNew, setIsNew] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const audioRef = useRef();
  const alertRef = useRef();
  const { t } = useTranslation();

  const audio = audioRef?.current?.audioEl?.current;
  const alert = alertRef?.current?.audioEl?.current;

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
      if (orders.length < menus?.data?.menu?.orders?.length) {
        setIsNew(true);
      } else if (calls.length < menus?.data?.menu?.calls?.length) {
        setIsNotification(true);
      }
      setOrders(menus?.data?.menu?.orders);
      setCalls(menus?.data?.menu?.calls);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (isNew) {
      enqueueSnackbar(t("panel:newOrder"), { variant: "success" });
      audio.play();
      setIsNew(false);
    } else if (isNotification) {
      enqueueSnackbar(t("panel:newRequest"), { variant: "success" });
      alert.play();
      setIsNotification(false);
    } else {
      return;
    }
  }, [isNew, isNotification]);

  return (
    <div className={styles.container}>
      <OrderNav orders={orders} storeLogo={storeLogo} storeName={storeName} />
      <StoreOrders orders={orders} calls={calls} />
      <div>
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1650899563/orderAlert_ltwbxs.mp3"
          ref={audioRef}
        />
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1651068677/bell_sr3k8n.mp3"
          ref={alertRef}
        />
      </div>
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
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default StoreOrderPanel;
