// Packages and Dependencies
import React from "react";
import Link from "next/link";
// Styles
import { Facebook, Instagram } from "@material-ui/icons";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div>
          <h1 className={styles.logo}>Logo</h1>
        </div>
        <div className={styles.right}>
          <div className={styles["social-container"]}>
            <div className={styles.icon}>
              <Facebook />
            </div>
            <a
              href="https://www.instagram.com/digicafes"
              target="_blank"
              className={styles.icon}
              rel="noreferrer"
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>
      <span className={styles.description}>©2022 Tüm hakları saklıdır.</span>
    </div>
  );
};

export default Footer;
