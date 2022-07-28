import React, { useState, useEffect, useContext } from "react";
import { Loading } from "@nextui-org/react";
import getRawBody from "raw-body";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "../checkout.module.css";
import axios from "axios";
import db from "../../../../utils/db";
import Order from "../../../../models/OrderModel";
import Booking from "../../../../models/Booking";
import User from "../../../../models/UserModel";

const Lobby = (props) => {
  const order = props.order;
  const user = props.user;
  const [isSuccess, setIsSuccess] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [conversationData, setConversationData] = useState("");

  const handleCompletePayment = async () => {
    try {
      const payment = await axios.post("/api/checkout/payment/complete-3ds", {
        conversationId: conversationId,
        paymentId: paymentId,
        conversationData: conversationData,
      });
      if (payment?.data?.status === "success") {
        await axios.patch("/api/user/payment", {
          id: user?._id,
          payment: payment?.data,
          storeName: order?.booking?.storeName,
        });
        await axios.patch("/api/booking/payment", {
          id: order?.booking?._id,
          payment: {
            ...payment?.data,
            user: user?._id,
          },
        });
        setIsSuccess(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (
      props?.body
        ?.split("&")
        .filter((item) => item.includes("status"))[0]
        ?.split("=")[1] === "success"
    ) {
      setConversationId(
        props?.body
          ?.split("&")
          .filter((item) => item.includes("conversationId"))[0]
          ?.split("=")[1]
      );
      setPaymentId(
        props?.body
          ?.split("&")
          .filter((item) => item.includes("paymentId"))[0]
          ?.split("=")[1]
      );
      setConversationData(
        props?.body
          ?.split("&")
          .filter((item) => item.includes("conversationData"))[0]
          ?.split("=")[1]
      );
    } else {
      setIsSuccess(false);
    }
  }, [props]);

  useEffect(() => {
    if (conversationId && paymentId) {
      handleCompletePayment();
    }
  }, [conversationId, paymentId]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isSuccess === null ? (
        <div
          style={{
            position: "absolute",
            top: "calc(50% - 30px)",
            left: "calc(50% - 30px)",
          }}
        >
          <Loading color="default" size="xl" />
        </div>
      ) : isSuccess && isSuccess !== null ? (
        <div
          className={styles.right}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            height: "100vh",
          }}
        >
          <CheckCircleOutlineIcon
            color="success"
            style={{ fontSize: "7rem" }}
          />
          <h3 style={{ color: "#000814" }} align="center">
            Satın aldığınız için teşekkür ederiz.
          </h3>
        </div>
      ) : isSuccess === "false" && isSuccess !== null ? (
        <div
          className={styles.right}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            height: "100vh",
          }}
        >
          <ErrorOutlineIcon color="error" style={{ fontSize: "7rem" }} />
          <h3 style={{ color: "#000814" }} align="center">
            Ödeme gerçekleştirilemedi.
          </h3>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;
  const { orderId } = context.query;
  const { userId } = context.query;
  await db.connect();
  const order = await Order.findOne({ _id: orderId }).populate({
    path: "booking",
    model: Booking,
  });
  const user = await User.findOne({ _id: userId });
  await db.disconnect();
  const body = await getRawBody(req);
  return {
    props: {
      body: body.toString("utf-8"),
      order: JSON.parse(JSON.stringify(order)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default Lobby;
