import { Button } from "@mui/material";
import React, { useEffect } from "react";
import styles from "./Features.module.css";
import QRCode from "qrcode";
import { useState } from "react";
import Aos from "aos";
import useTranslation from "next-translate/useTranslation";
import { Store } from "../../redux/store";
import { useContext } from "react";

const Features = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [isMobile, setIsMobile] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    if (window.innerWidth <= 760) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
    Aos.refresh();
  }, []);
  const [src, setSrc] = useState("");
  const [src2, setSrc2] = useState("");
  var opts = {
    errorCorrectionLevel: "H",
    type: "image/png",
    quality: 1,
    margin: 0,
    padding: 0,
  };
  QRCode.toDataURL(
    "https://www.digicafes.com/qr/v1/marcho-pascha-3",
    opts
  ).then(setSrc);
  QRCode.toDataURL("https://www.digicafes.com/qr/v2/demo/1", opts).then(
    setSrc2
  );

  return (
    <section className={styles.section} id="paketler">
      <article className={styles.article} data-aos="fade-right">
        <h2 className={styles.header}>{t("features:v1")}</h2>
        <span className={styles.priceDes}>
          <span className={styles.price}>{t("features:pricev1")}</span>
          <span> / </span>
          {t("features:annually")}
        </span>
        <ul className={styles.list}>
          <li>{t("features:v1f1")}</li>
          <li>{t("features:v1f2")}</li>
          <li>{t("features:v1f3")}</li>
          <li>{t("features:v1f4")}</li>
          <li>{t("features:v1f5")}</li>
        </ul>
        <p className={styles.articleDesc}>{t("features:v1d1")}</p>
        {!isMobile && (
          <div className={styles.demo}>
            <h3 className={styles.demoHeader}>{t("features:v1s1")}</h3>
            <img src={src} width="96px"></img>
          </div>
        )}
        {isMobile && (
          <a
            href="https://www.digicafes.com/qr/v1/marcho-pascha-3"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="contained"
              style={{
                width: "12rem",
                margin: "1rem",
                backgroundColor: "#edf2f4",
                color: "#001219",
              }}
            >
              {t("features:v1s1")}
            </Button>
          </a>
        )}
        {userInfo ? (
          <a
            className={styles.buy}
            href="https://iyzi.link/AIUgpA"
            rel="noreferrer"
            target="_blank"
          >
            {t("features:buy")}
          </a>
        ) : (
          <h4>Satın almak için üye olunuz.</h4>
        )}
      </article>
      <article className={styles.article} data-aos="fade-left">
        <h2 className={styles.header}>{t("features:v2")}</h2>
        <span className={styles.priceDes}>
          <span className={styles.price}>{t("features:pricev2")}</span>
          <span> / </span>
          {t("features:annually")}
        </span>
        <ul className={styles.list}>
          <li>{t("features:includesv1")}</li>
          <li>+</li>
          <li>{t("features:v2f6")}</li>
          <li>{t("features:v2f7")}</li>
          <li>{t("features:v2f8")}</li>
        </ul>
        <p className={styles.articleDesc}>{t("features:v2d1")}</p>
        {!isMobile && (
          <div className={styles.demo}>
            <h3 className={styles.demoHeader}>{t("features:v1s1")}</h3>
            <img src={src2} width="96px"></img>
          </div>
        )}
        {isMobile && (
          <a
            href="https://www.digicafes.com/qr/v2/demo/1"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="contained"
              style={{
                width: "12rem",
                margin: "1rem",
                backgroundColor: "#edf2f4",
                color: "#001219",
              }}
            >
              {t("features:v1s1")}
            </Button>
          </a>
        )}
        {userInfo ? (
          <a
            className={styles.buy}
            href="https://iyzi.link/AIUgyw"
            rel="noreferrer"
            target="_blank"
          >
            {t("features:buy")}
          </a>
        ) : (
          <h4>Satın almak için üye olunuz.</h4>
        )}
      </article>
    </section>
  );
};

export default Features;
