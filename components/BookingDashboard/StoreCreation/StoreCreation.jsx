import React, { useEffect, useState } from "react";
import { Loading, Modal, Spacer, Button as ButtonMui } from "@nextui-org/react";
import Radium, { StyleRoot } from "radium";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import styles from "./StoreCreation.module.css";
import { fadeInRightBig } from "react-animations";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const StoreCreation = ({ userOrder, booking }) => {
  const [order, setOrder] = useState(userOrder[0] || null);
  console.log(order);
  const [isFirst, setIsFirst] = useState(null);
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [storeName, setStoreName] = useState(booking?.storeName || "");
  const [allStoreNames, setAllStoreNames] = useState([]);
  const [tableNum, setTableNum] = useState(booking?.tableNum || null);
  const router = useRouter();
  const [storeLinkName, setStoreLinkName] = useState(
    booking?.storeLinkName || ""
  );

  const [secondStep, setSecondStep] = useState(false);
  const { t } = useTranslation();
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  useEffect(() => {
    if (isFirst) {
      router.push("/");
    }
  }, [isFirst]);
  /*   useEffect(() => {
    const getMenus = async () => {
      await axios
        .get("/api/bookings", {
          headers: { authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          setAllStoreNames(response.data.store);
        });
    };
    getMenus();
  }, []); */

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date();

    try {
      setIsFetchingForFirst(true);
      const { data } = await axios.post(
        `/api/booking/${storeName}`,
        {
          storeName: storeName,
          storeLinkName: storeLinkName,
          tableNum,
          createdAt,
          owner: order?.user?._id,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      console.log(data);
      const attachedOrder = await axios.patch(
        "/api/order/attachBooking",
        {
          orderId: order?._id,
          bookingId: data?.store?._id,
          orderProduct: order?.product?.name,
        },
        {
          headers: { authorization: `Bearer ${user?.token}` },
        }
      );
      setOrder(attachedOrder?.data?.order);
      setIsFirst(false);
      setIsFetchingForFirst(false);
    } catch (err) {
      console.log(err);
      setIsFetchingForFirst(false);
    }
  };

  return (
    <div>
      <div className={styles.firstContainer}>
        <Modal
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
          preventClose
          aria-labelledby="modal-title"
          open={isFetchingForFirst}
        >
          <Loading color="white" size="xl" />
          <Spacer />
        </Modal>
        {!secondStep && (
          <StyleRoot>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>
                {t("panel:enterStoreName")}
              </h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    id="brandName"
                    autoFocus="true"
                    rules={{
                      required: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setStoreName(e.target.value.trim());
                      setStoreLinkName(
                        e.target.value
                          .trim()
                          .toLowerCase()
                          .replaceAll(" ", "-")
                          .replaceAll("ç", "c")
                          .replaceAll("ı", "i")
                          .replaceAll("ü", "u")
                          .replaceAll("ğ", "g")
                          .replaceAll("ö", "o")
                          .replaceAll("ş", "s")
                      );
                    }}
                    label={t("panel:storeName")}
                    helperText={
                      storeName?.length === 0
                        ? t("panel:proveName")
                        : storeName?.length < 3
                        ? t("panel:minLength")
                        : containsSpecialChars(storeName) === true
                        ? t("panel:notSpecial")
                        : allStoreNames?.filter(
                            (s) => s?.storeName === storeName
                          ).length > 0
                        ? t("panel:nameIsInUse")
                        : ""
                    }
                  ></TextField>
                </ListItem>
                {!secondStep && (
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          storeName?.length > 2 &&
                          !containsSpecialChars(storeName) &&
                          allStoreNames?.filter(
                            (s) => s?.storeName === storeName
                          ).length === 0
                        ) {
                          setSecondStep(true);
                        }
                      }}
                    >
                      {t("panel:next")}
                    </Button>
                  </ListItem>
                )}
              </List>
            </form>
          </StyleRoot>
        )}
        {secondStep && (
          <StyleRoot>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>{t("panel:tableQuantity")}</h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    id="tableNum"
                    type="number"
                    autoFocus="true"
                    rules={{
                      required: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      e.preventDefault();
                      setTableNum(+e.target.value);
                    }}
                    helperText={
                      tableNum === undefined
                        ? t("panel:tableQuantity")
                        : tableNum === 0
                        ? t("panel:tableZero")
                        : tableNum < 0
                        ? t("panel:tableNeg")
                        : tableNum > 100
                        ? t("panel:tableNumMax2")
                        : ""
                    }
                    label={t("panel:numTable")}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        tableNum !== undefined &&
                        tableNum < 101 &&
                        tableNum > 0 &&
                        tableNum !== 0
                      ) {
                        firstTimeHandler(e);
                      }
                    }}
                  >
                    {t("panel:save")}
                  </Button>
                </ListItem>
              </List>
            </form>
          </StyleRoot>
        )}
      </div>
    </div>
  );
};

export default StoreCreation;
