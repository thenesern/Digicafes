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
                <Home color="primary" />
                <h6 className={styles.title}>Ana Sayfa</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link href="/admin/dashboard" className={styles.link} passHref>
              <button className={styles.button}>
                <Home color="primary" />
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
                <Group color="primary" />
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
                <ShoppingCartOutlined color="primary" />
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
                <StoreMallDirectory color="primary" />
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
                <BarChartOutlined color="primary" />
                <h6 className={styles.title}>Kazançlar</h6>
              </button>
            </Link>
          </li>
        </ul>

        <h6 className={styles.header}>Ana Sayfa</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link passHref href="/dashboard/footer" className={styles.link}>
              <button className={styles.button}>
                <CallToAction color="primary" />
                <h6 className={styles.title}>Footer</h6>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
