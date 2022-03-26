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
        <h6 className={styles.header}>Dashboard</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link href="/admin/panel" className={styles.link} passHref>
              <button className={styles.button}>
                <Home color="primary" />
                <h6 className={styles.title}>Home</h6>
              </button>
            </Link>
          </li>
        </ul>
        <h6 className={styles.header}>Analytics</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link href="/dashboard" className={styles.link} passHref>
              <button className={styles.button}>
                <ShoppingCartOutlined color="primary" />
                <h6 className={styles.title}>Orders</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link href="/dashboard" className={styles.link} passHref>
              <button className={styles.button}>
                <BarChartOutlined color="primary" />
                <h6 className={styles.title}>Earnings</h6>
              </button>
            </Link>
          </li>
        </ul>
        <h6 className={styles.header}>Management</h6>
        <ul className={styles.list}>
          <li className={styles.li}>
            <Link href="/dashboard/products" className={styles.link} passHref>
              <button className={styles.button}>
                <StoreMallDirectory color="primary" />
                <h6 className={styles.title}>Products</h6>
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link passHref href="/dashboard/users" className={styles.link}>
              <button className={styles.button}>
                <Group color="primary" />
                <h6 className={styles.title}>Users</h6>
              </button>
            </Link>
          </li>
        </ul>
        <h6 className={styles.header}>Main Menu</h6>
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
