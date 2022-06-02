// Packages and Dependencies
import React, { useState, useEffect } from "react";
// Styles
import styles from "./OrderNav.module.css";
// Translation
import useTranslation from "next-translate/useTranslation";

const OrderNav = (props) => {
  let newDates = [];
  const [dates, setDates] = useState(
    props.orders?.map((o) => {
      let createdAt = new Date(o.createdAt);
      newDates.push(new Date(createdAt).toLocaleString().split(" ")[0]);
    })
  );
  const [favs, setFavs] = useState(
    props.orders?.map((o) => o.cartItems.map((a) => a.name).toString())
  );
  const [favItemCount, setFavItemCount] = useState(null);
  let m = 0;
  const [favItem, setFavItem] = useState("");
  const date = new Date().toLocaleDateString();
  const week = [];
  const month = [];
  const [length, setLength] = useState(null);
  const days = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];
  const weekOrders = [];
  const monthOrders = [];
  const d = new Date();
  let day = days[d.getDay()];
  // Translation
  const { t } = useTranslation();

  function setFavItems() {
    for (let i = 0; i < favs.length; i++) {
      for (let j = i; j < favs.length; j++) {
        if (favs[i] == favs[j]) m++;
        if (favItemCount < m) {
          favItemCount = m;
          setFavItem(favs[i]);
          setFavItemCount(favItemCount);
        }
      }

      m = 0;
    }
  }
  useEffect(() => {
    setFavItems();
  }, []);

  useEffect(() => {
    setDates(props.orders?.map((o) => o.createdAt.split(" ")[0]));
  }, [props]);

  useEffect(() => {
    if (day === "Pazar") {
      setLength(7);
    } else if (day === "Pazartesi") {
      setLength(1);
    } else if (day === "Salı") {
      setLength(2);
    } else if (day === "Çarşamba") {
      setLength(3);
    } else if (day === "Perşembe") {
      setLength(4);
    } else if (day === "Cuma") {
      setLength(5);
    } else if (day === "Cumartesi") {
      setLength(6);
    } else {
      return;
    }
  }, []);

  for (let i = 0; i < length; i++) {
    week.push(date.replace(date.split(".")[0][1], date.split(".")[0][1] - i));
  }
  for (let i = 0; i < date.split(".")[0]; i++) {
    if (date.split(".")[0] !== 0) {
      month.push(
        date.replace(date.split(".")[0][1], date.split(".")[0][1] - i)
      );
    } else {
      return;
    }
  }

  for (let i = 0; i < newDates.length; i++) {
    if (newDates.some((ele) => week?.includes(ele))) {
      weekOrders.push("true");
    }
  }
  for (let i = 0; i < newDates.length; i++) {
    if (newDates.some((ele) => month?.includes(ele))) {
      monthOrders.push("true");
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        {props?.storeLogo ? (
          <img src={props?.storeLogo} alt="Logo" className={styles.storeLogo} />
        ) : (
          <h4>{props?.storeName.toUpperCase()}</h4>
        )}
      </div>
      <div className={styles.favs}>
        <h3 className={styles.header}>{t("panel:favs")}</h3>
        <div className={styles.periods}>
          <span>
            {(favItem && favItem + " " + `(${favItemCount})`) ||
              t("common:notFound")}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <h5 className={styles.header}>{t("panel:orders")}</h5>
        <div className={styles.orders}>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:today")}</h6>
            <span>
              {newDates.map((a) => a === date).filter((d) => d === true)
                .length || 0}
            </span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:week")}</h6>
            <span>{weekOrders.length || 0}</span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>{t("panel:month")}</h6>
            <span>{monthOrders.length || 0}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OrderNav;
