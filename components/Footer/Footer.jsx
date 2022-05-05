// Packages and Dependencies
import React from "react";
import Image from "next/image";
import logo from "../../assets/digi_dark_logo.svg";
// Styles
import { Facebook, Instagram } from "@material-ui/icons";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div>
          <Image
            style={{ cursor: "pointer" }}
            src={logo}
            width="200px"
            objectFit="contain"
            height="100px"
          ></Image>
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
      <span className={styles.description}>
        ©{new Date().getFullYear()} Tüm hakları saklıdır.
      </span>
    </div>
  );
};

export default Footer;
