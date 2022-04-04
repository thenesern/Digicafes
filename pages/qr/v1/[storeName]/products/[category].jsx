import { useRouter } from "next/router";
import React from "react";
import styles from "./products.module.css";
import db from "../../../../../utils/db.js";
import QRMenu from "../../../../../models/QRMenuModel.js";
import Link from "next/link";

const StoreMenu = ({ menu, category }) => {
  const filtered = menu?.products.filter((a) => a.category.includes(category));
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
          filtered?.map((m) => (
            <li className={styles.listItem} key={m?.name}>
              <img className={styles.img} src={m?.image} alt="" />
              <div className={styles.bottom}>
                <h3 className={styles.name}>{m?.name}</h3>
                <p className={styles.price}>₺{m?.price}</p>
              </div>
            </li>
          ))}
      </ul>
      <footer></footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { category } = context.query;
  const { storeName } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeName: storeName,
  }).lean();
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
      category,
    },
  };
}
export default StoreMenu;
