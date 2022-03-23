// Dependencies
import React from "react";
import {
  Facebook,
  Instagram,
  MailOutline,
  Payment,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from "@material-ui/icons";
import Link from "next/link";
// Styles
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.logo}>Logo</h1>
        <p className={styles.description}>©2022 Brand Name Dijital Çözümler.</p>
        <span className={styles.description}>Tüm hakları saklıdır.</span>
        <div className={styles["social-container"]}>
          <div className={styles.icon}>
            <Facebook />
          </div>
          <div className={styles.icon}>
            <Instagram />
          </div>
          <div className={styles.icon}>
            <Twitter />
          </div>
          <div className={styles.icon}>
            <Pinterest />
          </div>
        </div>
      </div>
      <div className={styles.center}>
        <h3 className={styles.title}>Kurumsal</h3>
        <ul className={styles.list}>
          <li className={styles["list-item"]}>
            <Link href="/" className={styles.link} passHref>
              Ana Sayfa
            </Link>
          </li>
          <li className={styles["list-item"]}>Hakkımızda</li>
          <li className={styles["list-item"]}>İletişim</li>
        </ul>
      </div>
      <div className={styles.center}>
        <h3 className={styles.title}>Hizmetlerimiz</h3>
        <ul className={styles.list}>
          <li className={styles["list-item"]}>
            <Link href="/dijital-menu" className={styles.link} passHref>
              Dijital Menü
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        <img
          className={styles.card}
          src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/master-card.png"
        />
        <img
          className={styles.card}
          src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/visa.png"
        />
        <img
          className={styles.iyzico}
          src="https://raw.githubusercontent.com/thenesern/project/969fada3dd5d63aebf5dfcedc97067e21fef98b3/assets/image/iyzico-logo-subbrands-pwi.svg"
        />
      </div>
    </div>
  );
};

export default Footer;
