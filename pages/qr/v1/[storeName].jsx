import { useRouter } from "next/router";
import React from "react";
import styles from "./store.module.css";
import db from "../../../utils/db.js";
import QRMenu from "../../../models/QRMenuModel.js";
import Link from "next/link";

const StoreMenu = ({ menu }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        <h6 className={styles.logo}>Logo</h6>
        <div className={styles.nav}>Nav</div>
      </navbar>
      <div>
        <h6>Menü</h6>
      </div>
      <ul className={styles.list}>
        {menu &&
          menu?.categories.map((m) => (
            <Link href="/" passHref key={m.name}>
              <li
                className={styles.listItem}
                style={{ backgroundImage: `url(${m.image})` }}
              >
                <div className={styles.titleBack}>
                  <h3 className={styles.title}>{m.name}</h3>
                </div>
              </li>
            </Link>
          ))}
      </ul>
      <footer></footer>
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
  const menu = await QRMenu.findOne({
    storeName: `${params.storeName}`,
  }).lean();
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}

export default StoreMenu;
