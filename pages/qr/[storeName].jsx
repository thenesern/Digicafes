import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./store.module.css";
import db from "../../utils/db.js";
import QRMenu from "../../models/QRMenuModel.js";

const StoreMenu = ({ menu }) => {
  const router = useRouter();

  console.log(menu);
  return (
    <div className={styles.container}>
      <navbar>
        <h6>Logo</h6>
        <div>Nav</div>
      </navbar>
      {/*  {menu.products.map((m) => (
        <p>{m.category}</p>
      ))} */}
    </div>
  );
};

export async function getStaticPaths() {
  await db.connect();
  const menus = await QRMenu.find();
  await db.disconnect();
  return {
    paths: menus.map((menu) => {
      return {
        params: { storeName: menu.storeName },
      };
    }),
    fallback: false, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const menu = await QRMenu.findOne({ storeName: "Aa" }).lean();
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}

export default StoreMenu;
