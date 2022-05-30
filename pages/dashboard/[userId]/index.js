import React from "react";
import Nav2 from "../../../components/Nav2/Nav";
import styles from "./dashboard.module.css";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import useTranslation from "next-translate/useTranslation";

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = router.query.userId;
  const [isFetching, setIsFetching] = useState(false);
  const [orders, setOrders] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const newDate = new Date();

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
        setOrders(userOrder?.data?.order);
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
      <Nav2 />
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
        <h3 className={styles.title}>{t("panels:header")}</h3>
        {orders ? (
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
                    <h6 className={styles.subtitle}>
                      {order?.product?.name.includes("V1")
                        ? t("panels:v1")
                        : t("panels:v2")}
                    </h6>
                  </button>
                </Link>
              </div>
              <div className={styles.infos}>
                <div className={styles.infoCell}>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <div>
                      <div>
                        <h4>{t("panels:store")}</h4>
                        <p>
                          {order?.menuv1
                            ? order?.menuv1?.storeName
                            : t("panels:not")}
                        </p>
                      </div>
                    </div>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <div>
                      <div>
                        <h4>{t("panels:store")}</h4>
                        <p>
                          {order?.menuv2
                            ? order?.menuv2?.storeName
                            : t("panels:not")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>{t("panels:created")}</h4>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <p>{order?.menuv1?.createdAt || t("panels:not")}</p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>{order?.menuv2?.createdAt || t("panels:not")}</p>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>{t("panels:updated")}</h4>
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
              <div className={styles.infos}>
                <div className={styles.infoCell}>
                  {new Date(order?.expiry?.toString()).getTime() >
                  newDate.getTime() ? (
                    <div>
                      <h4>{t("panels:status")}</h4>
                      <p>
                        {t("panels:active")} (
                        {
                          new Date(
                            new Date(order?.expiry?.toString()).getTime()
                          )
                            ?.toLocaleString()
                            .split(" ")[0]
                        }
                        )
                      </p>
                    </div>
                  ) : (
                    <div className={styles.expired}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <h4>{t("panels:status")}</h4>
                        <p style={{ margin: "0" }}>
                          {t("panels:expired")} (
                          {
                            new Date(
                              new Date(order?.expiry?.toString()).getTime()
                            )
                              ?.toLocaleString()
                              .split(" ")[0]
                          }
                          )
                        </p>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          minWidth: "15rem",
                        }}
                      >
                        <h4 style={{ width: "100%" }}>
                          {t("panels:continue")}
                        </h4>
                        {order?.product?.name.includes("V1") ? (
                          <a
                            className={styles.buy}
                            href="https://iyzi.link/AIUgpA"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t("panels:buy")}
                          </a>
                        ) : (
                          <a
                            className={styles.buy}
                            href="https://iyzi.link/AIUgyw"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {t("panels:buy")}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Stack spacing={1} width={"100%"}>
            <Skeleton width={"98%"} style={{ margin: "0 auto" }} height={200} />
          </Stack>
        )}
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
