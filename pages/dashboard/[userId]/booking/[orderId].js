import React, { useContext, useState } from "react";
import Nav from "../../../../components/Nav/Nav";
import styles from "./booking.module.css";
import Order from "../../../../models/OrderModel";
import Product from "../../../../models/ProductModel";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
import BookingModel from "../../../../models/Booking";
import Cookies from "js-cookie";
import { useEffect } from "react";
import StoreCreation from "../../../../components/Booking/BookingDashboard/StoreCreation/StoreCreation";
import BookingDashboard from "../../../../components/Booking/BookingDashboard/Dashboard/BookingDashboard";
import { Avatar, Skeleton } from "@mui/material";
import { Store } from "../../../../redux/store";
import axios from "axios";

const Booking = (props) => {
  const [userOrder, setUserOrder] = useState(props.userOrder);
  const [isFirst, setIsFirst] = useState(null);
  const { state } = useContext(Store);
  const { storeCreated } = state;

  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  useEffect(() => {
    if (storeCreated === true) {
      getStore();
    }
  }, [storeCreated]);

  useEffect(() => {
    if (userOrder) {
      if (userOrder[0]?.booking) {
        setIsFirst(false);
      } else {
        setIsFirst(true);
      }
    }
  }, [userOrder]);

  const getStore = async () => {
    try {
      axios
        .post(
          `/api/order/user`,
          {
            user: userOrder[0]?.user?._id,
          },
          {
            headers: { authorization: `Bearer ${user?.token}` },
          }
        )
        .then((result) => {
          setUserOrder(
            result.data.order.filter(
              (order) => order?._id === props.userOrder[0]?._id
            )
          );
          setIsFirst(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Rendering
  if (isFirst === true) {
    return (
      <div className={styles.container}>
        <Nav color={"#c9184a"} />
        <StoreCreation userOrder={userOrder} />
      </div>
    );
  }
  if (isFirst === false) {
    return (
      <div className={styles.container}>
        <Nav color={"#c9184a"} />
        <BookingDashboard userOrder={userOrder[0]} />
      </div>
    );
  }
  if (isFirst === null || undefined) {
    return (
      <div className={styles.container}>
        <Nav color={"#c9184a"} />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "90vh",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              width: "10vw",
              height: "90vh",
              padding: "1rem 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Skeleton
              variant="circular"
              width={"10vw"}
              height={"20vh"}
              style={{ margin: "0 auto" }}
            >
              <Avatar />
            </Skeleton>
            <Skeleton variant="rectangular" width={"10vw"} height={"70vh"} />
          </div>
          <div
            style={{
              width: "90vw",
              height: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton
              variant="rectangular"
              style={{ width: "80vw", height: "80vh", margin: "0 auto" }}
            />
          </div>
        </div>
      </div>
    );
  }
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
