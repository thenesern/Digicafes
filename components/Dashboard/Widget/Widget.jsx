import React from "react";
import styles from "./Widget.module.css";

import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useEffect } from "react";
import db from "../../../utils/db.js";
import axios from "axios";
import {
  MonetizationOnOutlined,
  PersonOutlined,
  ShoppingCartOutlined,
  StoreMallDirectoryTwoTone,
} from "@material-ui/icons";

const Widget = (props) => {
  let data;

  switch (props.type) {
    case "users":
      data = {
        title: "Kullanıcılar",
        isMoney: false,
        link: "/admin/dashboard/users",
        amount: props.users,
        icon: (
          <PersonOutlined
            className={styles.icon}
            style={{ color: "#005f73" }}
          />
        ),
      };
      break;
    case "orders":
      data = {
        title: "Siparişler",
        isMoney: false,
        link: "/admin/dashboard/siparisler",
        amount: props.orders,
        icon: (
          <ShoppingCartOutlined
            className={styles.icon}
            style={{ color: "#ee9b00" }}
          />
        ),
      };
      break;
    case "earnings":
      data = {
        title: "Kazançlar",
        isMoney: false,
        link: "/admin/dashboard/kazanclar",
        amount: props.earnings,
        icon: (
          <MonetizationOnOutlined
            className={styles.icon}
            style={{ color: "#606c38" }}
          />
        ),
      };
      break;
    case "products":
      data = {
        title: "Ürünler",
        isMoney: false,
        link: "/admin/dashboard/urunler",
        amount: props.products,
        icon: (
          <StoreMallDirectoryTwoTone
            className={styles.icon}
            style={{ color: "#001219" }}
          />
        ),
      };
      break;
    default:
      break;
  }
  return (
    <div className={styles.widget}>
      <div className={styles.left}>
        <h6 className={styles.title}>{data?.title}</h6>
        <span className={styles.counter}>
          {data?.isMoney && "$"} {data?.amount}
        </span>
        <Link href={data.link} className={styles.link} passHref>
          <h6 className={styles.link}>Sayafaya Git - {data?.title}</h6>
        </Link>
      </div>
      <div className={styles.right}>{data?.icon}</div>
    </div>
  );
};

export default Widget;
