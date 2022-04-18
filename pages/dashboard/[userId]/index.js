import React from "react";
import Nav from "../../../components/Nav/Nav";
import User from "../../../models/UserModel";
import Order from "../../../models/OrderModel";
import db from "../../../utils/db";
import styles from "./dashboard.module.css";
import Product from "../../../models/ProductModel";
import QRMenu1 from "../../../models/QRMenu1Model";
import QRMenu2 from "../../../models/QRMenu2Model";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";

const Dashboard = ({ orders, user }) => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <Modal
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
          preventClose
          aria-labelledby="modal-title"
          open={isFetching}
        >
          <Modal.Body>
            <Loading color="white" size="xl" />
            <Spacer />
          </Modal.Body>
        </Modal>
        <h3 className={styles.title}>Yönetim Paneli</h3>
        {orders.length > 0 &&
          orders.map((order) => (
            <div key={order._id} className={styles.panel}>
              <div>
                <h3>Panel</h3>
                <Link
                  href={
                    order?.product?.name === "Dijital Menü - V1"
                      ? `/dashboard/${user}/menu/v1/${order._id}`
                      : `/dashboard/${user}/menu/v2/${order._id}`
                  }
                  passHref
                >
                  <button
                    className={styles.button}
                    onClick={() => {
                      if (
                        router?.pathname !==
                        "/dashboard/[userId]/menu/v1/[orderId]"
                      ) {
                        setIsFetching(true);
                      }
                    }}
                  >
                    <h6 className={styles.subtitle}>{order?.product?.name}</h6>
                  </button>
                </Link>
              </div>
              <div className={styles.infos}>
                <div className={styles.infoCell}>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <div>
                      <div>
                        <h4>İş Yeri Adı</h4>
                        <p>
                          {order?.menuv1
                            ? order?.menuv1?.storeName
                            : "Henüz Oluşturulmadı"}
                        </p>
                      </div>
                    </div>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <div>
                      <div>
                        <h4>İş Yeri Adı</h4>
                        <p>
                          {order?.menuv2
                            ? order?.menuv2?.storeName
                            : "Henüz Oluşturulmadı"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>Oluşturulma Tarihi</h4>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <p>{order?.menuv1?.createdAt || "Henüz Oluşturulmadı"}</p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>{order?.menuv2?.createdAt || "Henüz Oluşturulmadı"}</p>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>Son Güncellenme Tarihi</h4>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <p>
                      {order?.menuv1?.updatedAt
                        ? new Date(
                            `${order?.menuv1?.updatedAt}`
                          ).toLocaleString("tr-TR")
                        : "Henüz Oluşturulmadı"}
                    </p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>
                      {order?.menuv2?.updatedAt
                        ? new Date(
                            `${order?.menuv2?.updatedAt}`
                          ).toLocaleString("tr-TR")
                        : "Henüz Oluşturulmadı"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        {orders.length < 1 && (
          <div className={styles.orderNotFound}>
            <img
              className={styles.orderNotFoundImage}
              src="https://img.icons8.com/cotton/452/shopping-cart--v1.png"
            />
            <h4>Sipariş bulunamadı.</h4>
            <p className={styles.info}>
              Satın almış olduğunuz paketlerin Yönetim Paneline buradan
              ulaşabilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
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
  const orders = await Order.find({ user: userId })
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User })
    .populate({ path: "menuv1", model: QRMenu1 })
    .populate({ path: "menuv2", model: QRMenu2 });

  await db.disconnect();
  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
      user: userId,
    },
  };
}

export default Dashboard;
