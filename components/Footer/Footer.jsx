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
      <h1 className={styles.logo}>Logo</h1>
      <div className={styles["social-container"]}>
        <div className={styles.icon}>
          <Facebook />
        </div>
        <div className={styles.icon}>
          <Instagram />
        </div>
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
      <span className={styles.description}>©2022 Tüm hakları saklıdır.</span>
    </div>
  );
};

export default Footer;
