import React, { useState, useEffect, useContext } from "react";
import { Loading } from "@nextui-org/react";
import getRawBody from "raw-body";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "./checkout.module.css";
import axios from "axios";
import { Store } from "../../../redux/store";
import { useRouter } from "next/router";
import db from "../../../utils/db";
import Order from "../../../models/OrderModel";

const Lobby = (props) => {
  const [order, setOrder] = useState(props?.order);
  const [isSuccess, setIsSuccess] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [conversationData, setConversationData] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;

  const handleCompletePayment = async () => {
    try {
      const payment = await axios.post("/api/checkout/payment/complete-3ds", {
        conversationId: conversationId,
        paymentId: paymentId,
        conversationData: conversationData,
      });
      if (payment?.data?.status === "success") {
        setIsSuccess(true);
        await axios.patch(
          "/api/order",
          {
            id: order?._id,
            quantity: 365,
            payment: payment?.data,
            expiry: new Date(
              new Date(order?.expiry)?.setDate(
                new Date(order?.expiry)?.getDate() + 360
              )
            ),
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
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
          }}
        >
          <h3 style={{ color: "#000814" }} align="center">
            Satın aldığınız için teşekkür ederiz.
          </h3>
          <CheckCircleOutlineIcon
            color="success"
            style={{ fontSize: "7rem" }}
          />
        </div>
      ) : isSuccess === "false" && isSuccess !== null ? (
        <div
          className={styles.right}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <h3 style={{ color: "#000814" }} align="center">
            Ödeme gerçekleştirilemedi.
          </h3>
          <ErrorOutlineIcon color="error" style={{ fontSize: "7rem" }} />
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
  await db.connect();
  const order = await Order.findOne({ _id: orderId });
  await db.disconnect();
  const body = await getRawBody(req);
  return {
    props: {
      body: body.toString("utf-8"),
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default Lobby;
