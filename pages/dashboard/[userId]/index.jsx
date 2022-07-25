// Dependencies
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Button, Image, Loading, Modal, Spacer } from "@nextui-org/react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Popover from "@mui/material/Popover";
// Components
import Nav2 from "../../../components/Nav2/Nav";
// Styles
import styles from "./dashboard.module.css";
// Translation
import useTranslation from "next-translate/useTranslation";
import { Store } from "../../../redux/store";
import { Typography } from "@mui/material";

const Dashboard = () => {
  // Translation
  const { t } = useTranslation();
  // Context
  const { state } = useContext(Store);
  const { userInfo } = state;
  // Router
  const router = useRouter();
  const userId = router.query.userId;

  const [isFetching, setIsFetching] = useState(false);
  const [orders, setOrders] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Fetching user's orders
  useEffect(() => {
    const getUserOrder = async () => {
      setIsFetching(true);
      try {
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userId,
          },
          { headers: { authorization: `Bearer ${userInfo?.token}` } }
        );
        setOrders(userOrder?.data?.order);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    getUserOrder();
  }, [userId, userInfo]);

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
                      : order?.product?.name === "Dijital Menü - V2"
                      ? `/dashboard/${userId}/menu/v2/${order._id}`
                      : `/dashboard/${userId}/booking/${order._id}`
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
                        : order?.product?.name.includes("V2")
                        ? t("panels:v2")
                        : t("panels:booking")}
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
                  {order?.product?.name === "Booking" && (
                    <div>
                      <div>
                        <h4>{t("panels:store")}</h4>
                        <p>
                          {order?.booking
                            ? order?.booking?.storeName
                            : t("panels:not")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>{t("panels:created")}</h4>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <p>
                      {order?.menuv1?.createdAt
                        ? order?.menuv1?.createdAt.includes("GMT") ||
                          !order?.menuv1?.createdAt.includes(" ")
                          ? new Date(order?.menuv1?.createdAt).toLocaleString()
                          : order?.menuv1?.createdAt
                        : t("panels:not")}
                    </p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>
                      {order?.menuv2?.createdAt
                        ? order?.menuv2?.createdAt.includes("GMT") ||
                          !order?.menuv2?.createdAt.includes(" ")
                          ? new Date(order?.menuv2?.createdAt).toLocaleString()
                          : order?.menuv2?.createdAt
                        : t("panels:not")}
                    </p>
                  )}
                  {order?.product?.name === "Booking" && (
                    <p>
                      {order?.booking?.createdAt
                        ? order?.booking?.createdAt.includes("GMT") ||
                          !order?.booking?.createdAt.includes(" ")
                          ? new Date(order?.booking?.createdAt).toLocaleString()
                          : order?.booking?.createdAt
                        : t("panels:not")}
                    </p>
                  )}
                </div>
                <div className={styles.infoCell}>
                  <h4>{t("panels:updated")}</h4>
                  {order?.product?.name === "Dijital Menü - V1" && (
                    <p>
                      {order?.menuv1?.updatedAt
                        ? order?.menuv1?.updatedAt.includes("GMT") ||
                          !order?.menuv1?.updatedAt.includes(" ")
                          ? new Date(order?.menuv1?.updatedAt).toLocaleString()
                          : order?.menuv1?.updatedAt
                        : t("panels:notUpdated")}
                    </p>
                  )}
                  {order?.product?.name === "Dijital Menü - V2" && (
                    <p>
                      {order?.menuv2?.updatedAt
                        ? order?.menuv2?.updatedAt.includes("GMT") ||
                          !order?.menuv2?.updatedAt.includes(" ")
                          ? new Date(order?.menuv2?.updatedAt).toLocaleString()
                          : order?.menuv2?.updatedAt
                        : t("panels:notUpdated")}
                    </p>
                  )}
                  {order?.product?.name === "Booking" && (
                    <p>
                      {order?.booking?.updatedAt
                        ? order?.booking?.updatedAt.includes("GMT") ||
                          !order?.booking?.updatedAt.includes(" ")
                          ? new Date(order?.booking?.updatedAt).toLocaleString()
                          : order?.booking?.updatedAt
                        : t("panels:notUpdated")}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.infos}>
                <div className={styles.infoCell}>
                  {new Date(
                    new Date(order.expiry).setMonth(
                      new Date(order.expiry).getMonth() - 1
                    )
                  ) > new Date() ? (
                    <div>
                      <h4>{t("panels:status")}</h4>
                      <p>
                        {t("panels:active")} (
                        {order?.expiry
                          ? order?.expiry.includes("GMT") ||
                            !order?.expiry.includes(" ")
                            ? new Date(order?.expiry).toLocaleDateString()
                            : order?.expiry
                          : t("panels:notUpdated")}
                        )
                      </p>
                    </div>
                  ) : new Date(order?.expiry?.toString()) < new Date() ? (
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
                        <h4 style={{ padding: " 0", marginBottom: "14px" }}>
                          {t("panels:status")}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            margin: "0",
                          }}
                        >
                          <p style={{ margin: "0", padding: "0" }}>
                            {t("panels:expired")} (
                            {order?.expiry
                              ? order?.expiry.includes("GMT") ||
                                !order?.expiry.includes(" ")
                                ? new Date(order?.expiry).toLocaleDateString()
                                : order?.expiry
                              : t("panels:notUpdated")}
                            )
                          </p>
                          <Link href={`/checkout/${order._id}`} passHref>
                            <Button
                              bordered
                              size="sm"
                              aria-owns={
                                open ? "mouse-over-popover" : undefined
                              }
                              aria-haspopup="true"
                              onMouseEnter={handlePopoverOpen}
                              onMouseLeave={handlePopoverClose}
                            >
                              Yükselt
                            </Button>
                          </Link>
                          <Popover
                            id="mouse-over-popover"
                            sx={{
                              pointerEvents: "none",
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                          >
                            <Typography sx={{ p: 1 }}>a</Typography>
                          </Popover>
                        </div>
                      </div>
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
                        <h4 style={{ padding: " 0", marginBottom: "14px" }}>
                          {t("panels:status")}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            margin: "0",
                          }}
                        >
                          <p style={{ margin: "0", padding: "0" }}>
                            Paketiniz yakında sonlanıyor. (
                            {order?.expiry
                              ? order?.expiry.includes("GMT") ||
                                !order?.expiry.includes(" ")
                                ? new Date(order?.expiry).toLocaleDateString()
                                : order?.expiry
                              : t("panels:notUpdated")}
                            )
                          </p>
                          <Link href={`/checkout/${order._id}`} passHref>
                            <Button bordered size="sm">
                              Yükselt
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Stack
            width={"98%"}
            margin={"0 auto"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
              height: "70vh",
            }}
          >
            <Skeleton width={"98%"} style={{ margin: "0 auto", flex: "1" }} />
            <Skeleton width={"98%"} style={{ margin: "0 auto", flex: "1" }} />
            <Skeleton width={"98%"} style={{ margin: "0 auto", flex: "1" }} />
            <Skeleton width={"98%"} style={{ margin: "0 auto", flex: "1" }} />
          </Stack>
        )}

        {orders?.length < 1 && (
          <div className={styles.orderNotFound}>
            <Image
              className={styles.orderNotFoundImage}
              width="160"
              height="200"
              alt="Order not found"
              src="https://res.cloudinary.com/dlyjd3mnb/image/upload/v1658762833/jdmsx78vs7eksq1jyrno.png"
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
