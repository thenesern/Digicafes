import React from "react";
import Nav from "../../../components/Nav/Nav";
import styles from "./dashboard.module.css";

import Link from "next/link";
import { useRouter } from "next/router";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Dashboard = () => {
  const router = useRouter();
  const userId = router.query.userId;
  const [isFetching, setIsFetching] = useState(false);
  const [orders, setOrders] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setUserToken(user?.token);
    }
  }, []);

  useEffect(() => {
    const getUserOrder = async () => {
      setIsFetching(true);
      try {
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userId,
          },
          { headers: { authorization: `Bearer ${userToken}` } }
        );
        setOrders(userOrder.data.order);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    getUserOrder();
  }, [userId, userToken]);
  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.dashboard}>
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
        {orders?.length > 0 &&
          orders.map((order) => (
            <div key={order._id} className={styles.panel}>
              <div>
                <h3>Panel</h3>
                <Link
                  href={
                    order?.product?.name === "Dijital Menü - V1"
                      ? `/dashboard/${userId}/menu/v1/${order._id}`
                      : `/dashboard/${userId}/menu/v2/${order._id}`
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
                        : "Henüz Güncellenmedi"}
                    </p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>
                      {order?.menuv2?.updatedAt
                        ? new Date(
                            `${order?.menuv2?.updatedAt}`
                          ).toLocaleString("tr-TR")
                        : "Henüz Güncellenmedi"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        {orders?.length < 1 && (
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

export default Dashboard;
