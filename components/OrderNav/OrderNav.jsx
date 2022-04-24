import { ArrowUpwardTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "./OrderNav.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
const OrderNav = (props) => {
  const [dates, setDates] = useState(
    props.orders?.map((o) => o.createdAt.split(" ")[0])
  );
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
      setLength(0);
    } else if (day === "Salı") {
      setLength(1);
    } else if (day === "Çarşamba") {
      setLength(2);
    } else if (day === "Perşembe") {
      setLength(3);
    } else if (day === "Cuma") {
      setLength(4);
    } else if (day === "Cumartesi") {
      setLength(5);
    } else {
      setLength(6);
    }
  }, []);
  const [length, setLength] = useState(null);
  for (let i = 0; i < length; i++) {
    week.push(date.replace(date.split(".")[0], date.split(".")[0] - i));
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
  for (let i = 0; i < dates.length; i++) {
    if (dates.some((ele) => week.includes(ele))) {
      weekOrders.push("true");
    }
  }
  /*   console.log(dates.map((a) => a.split(".")[0]));
  console.log(date.split(".")[0]); */
  console.log(weekOrders);
  for (let i = 0; i < day; i++) {}
  const d = new Date();
  let day = days[d.getDay()];
  return (
    <nav className={styles.nav}>
      <div>
        <Button
          variant="contained"
          style={{ backgroundColor: "#fbeee0", color: "#1d3557" }}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Panele Dön
        </Button>
      </div>
      <div>
        <img src="" alt="a" />
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
            <span>{"" || 0}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OrderNav;
