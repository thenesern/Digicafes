// Packages and Dependencies
import React from "react";
import Image from "next/image";
import logo from "../../assets/digi_dark_logo.svg";
import useTranslation from "next-translate/useTranslation";
// Styles
import { Facebook, Instagram } from "@material-ui/icons";
import styles from "./Footer.module.css";

const Footer = () => {
  const { t } = useTranslation();

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
        ©{new Date().getFullYear()} {t("footer:alert")}
      </span>
    </div>
  );
};

export default Footer;
