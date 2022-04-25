import { ArrowUpwardTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "./OrderNav.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
const OrderNav = (props) => {
  const [dates, setDates] = useState(
    props.orders?.map((o) => o.createdAt.split(" ")[0])
  );
  const [favs, setFavs] = useState(
    props.orders?.map((o) => o.cartItems.map((a) => a.name).toString())
  );
  const [favItemCount, setFavItemCount] = useState(null);
  let m = 0;
  const [favItem, setFavItem] = useState("");
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
  const date = new Date().toLocaleString("tr-TR").split(" ")[0];
  const week = [];
  const month = [];
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
  const [length, setLength] = useState(null);
  for (let i = 0; i < length; i++) {
    week.push(date.replace(date.split(".")[0], date.split(".")[0] - i));
  }
  for (let i = 0; i < date.split(".")[0]; i++) {
    if (date.split(".")[0] !== 0) {
      month.push(date.replace(date.split(".")[0], date.split(".")[0] - i));
    } else {
      return;
    }
  }
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
  for (let i = 0; i < dates.length; i++) {
    if (dates.some((ele) => week.includes(ele))) {
      weekOrders.push("true");
    }
  }
  for (let i = 0; i < dates.length; i++) {
    if (dates.some((ele) => month.includes(ele))) {
      monthOrders.push("true");
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img src={props.storeLogo} alt="Logo" className={styles.storeLogo} />
      </div>
      <div className={styles.favs}>
        <h3 className={styles.header}>En Sevilenler</h3>
        <div className={styles.periods}>
          <span>
            {(favItem && favItem + " " + `(${favItemCount})`) || "Yok"}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <h5 className={styles.header}>Siparişler</h5>
        <div className={styles.orders}>
          <div className={styles.periods}>
            <h6 className={styles.title}>Bugün</h6>
            <span>
              {dates.map((a) => a === date).filter((d) => d === true).length ||
                0}
            </span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>Bu Hafta</h6>
            <span>{weekOrders.length || 0}</span>
          </div>
          <div className={styles.periods}>
            <h6 className={styles.title}>Bu Ay</h6>
            <span>{monthOrders.length || 0}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OrderNav;
