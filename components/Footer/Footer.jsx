// Packages and Dependencies
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// Styles
import styles from "./Footer.module.css";
// Images
import { Facebook, Instagram } from "@material-ui/icons";
import logo from "../../assets/digi_dark_logo.svg";
import Providers from "../../assets/paymentProvider/providers.svg";
import whatsapp from "../../assets/image/whatsapp.png";
// Translation
import useTranslation from "next-translate/useTranslation";

const Footer = () => {
  const router = useRouter();
  // Translation
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.footer}>
        <div className={styles.brand}>
          <Image
            src={logo}
            width="200px"
            objectFit="contain"
            height="60px"
          ></Image>
          <ul className={styles.footerNavBar}>
            <li>
              <a href="about-us" target="_blank" className={styles.navLinks}>
                {t("footer:aboutUs")}
              </a>
            </li>
          </ul>
          <span className={styles.desc}>{t("common:footer")}</span>
          {router.locale === "tr" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/uyelik-sozlesmesi" target="_blank">
                <span className={styles.links}>Üyelik Sözleşmesi</span>
              </a>
              <a href="/gizlilik-politikasi" target="_blank">
                <span className={styles.links} style={{ marginLeft: "1rem" }}>
                  Gizlilik Politikası
                </span>
              </a>
              <a href="/cerez-politikasi" target="_blank">
                <span className={styles.links} style={{ marginLeft: "1rem" }}>
                  Çerez Politikası
                </span>
              </a>
              <a href="/mesafeli-satis-sozlesmesi" target="_blank">
                <span className={styles.links} style={{ marginLeft: "1rem" }}>
                  Mesafeli Satış Sözleşmesi
                </span>
              </a>
              <a href="/iptal-ve-iade-kosullari" target="_blank">
                <span className={styles.links} style={{ marginLeft: "1rem" }}>
                  İptal ve İade Koşulları
                </span>
              </a>
            </div>
          ) : (
            <div>
              <a href="/terms-of-service" target="_blank">
                <span className={styles.links}>Terms of Service</span>
              </a>
              <a href="/privacy-policy" target="_blank">
                <span className={styles.links} style={{ marginLeft: "1rem" }}>
                  Privacy Policy
                </span>
              </a>
            </div>
          )}
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
            {router?.locale === "tr" && (
              <div>
                <a
                  href="https://api.whatsapp.com/send?phone=905012345324"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    objectFit="contain"
                    src={whatsapp}
                    width="40"
                    height="40"
                  />
                </a>
              </div>
            )}
          </div>
          <div>
            <Image src={Providers} width="400" height="60" />
          </div>
        </div>
      </div>

      <span className={styles.description}>
        ©{new Date().getFullYear()} Digicafes | {t("footer:alert")}
      </span>
    </div>
  );
};

export default Footer;
