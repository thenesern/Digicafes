import { useRouter } from "next/router";
import React from "react";
import styles from "./products.module.css";
import db from "../../../../utils/db.js";
import QRMenu from "../../../../models/QRMenuModel.js";
import Link from "next/link";

const StoreMenu = ({ menu }) => {
  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        <h6 className={styles.logo}>Logo</h6>
        <div className={styles.nav}>Nav</div>
      </navbar>
      <div>
        <Link href={`localhost:3000/qr/v1/${menu.storeName}`} passHref>
          <button>Geri</button>
        </Link>
      </div>
      <ul className={styles.list}>
        {menu &&
          menu?.products?.map((m) => (
            <li className={styles.listItem} key={m?.name}>
              <img src={m?.image} alt="" />
              <div>
                <h3>{m?.name}</h3>
                <p>₺{m?.price}</p>
              </div>
            </li>
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
    storeName: params.storeName,
  }).lean();
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}

export default StoreMenu;
