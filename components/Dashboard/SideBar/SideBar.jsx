import {
  BarChartOutlined,
  CallToAction,
  Group,
  Home,
  LinearScale,
  ShoppingCartOutlined,
  StoreMallDirectory,
} from "@material-ui/icons";
import React from "react";
import Link from "next/link";
import styles from "./SideBar.module.css";

const SideBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h6 className={styles.header}>Panel</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link href="/" className={styles.link} passHref>
              <button className={styles.button}>
                <Home style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Ana Sayfa</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link href="/admin/dashboard" className={styles.link} passHref>
              <button className={styles.button}>
                <Home style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Panel</h6>
              </button>
            </Link>
          </li>
        </ul>
        <h6 className={styles.header}>Yönetim</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link
              passHref
              href="/admin/dashboard/users"
              className={styles.link}
            >
              <button className={styles.button}>
                <Group style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Kullanıcılar</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              href="/admin/dashboard/orders"
              className={styles.link}
              passHref
            >
              <button className={styles.button}>
                <ShoppingCartOutlined style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Siparişler</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link
              href="/admin/dashboard/products"
              className={styles.link}
              passHref
            >
              <button className={styles.button}>
                <StoreMallDirectory style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Ürünler</h6>
              </button>
            </Link>
          </li>
        </ul>
        <h6 className={styles.header}>Kazançlar</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link href="/dashboard" className={styles.link} passHref>
              <button className={styles.button}>
                <BarChartOutlined style={{ color: "#118ab2" }} />
                <h6 className={styles.title}>Kazançlar</h6>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
