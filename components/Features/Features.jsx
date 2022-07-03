// Packages and Dependencies
import { Button } from "@mui/material";
import React, { useEffect, useLayoutEffect } from "react";
import QRCode from "qrcode";
import { useState } from "react";
import Aos from "aos";
import { useRouter } from "next/router";
// Context
import { Store } from "../../redux/store";
import { useContext } from "react";
// Styles
import styles from "./Features.module.css";
// Translation
import useTranslation from "next-translate/useTranslation";
import { Loading } from "@nextui-org/react";

const Features = (props) => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [isMobile, setIsMobile] = useState();
  const [src, setSrc] = useState("");
  const [src2, setSrc2] = useState("");
  const [srcEn, setSrcEn] = useState("");
  const [src2En, setSrc2En] = useState("");
  // Translation
  const { t } = useTranslation();

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
  QRCode.toDataURL("https://www.digicafes.com/qr/v1/demo-en2", opts).then(
    setSrcEn
  );
  QRCode.toDataURL("https://www.digicafes.com/qr/v2/demo-en/1", opts).then(
    setSrc2En
  );

  useLayoutEffect(() => {
    if (window.screen.width <= 500) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
    Aos.refresh();
  }, []);

  return (
    <section className={styles.section} id="paketler">
      <article className={styles.article} data-aos="fade-right">
        <h2 className={styles.header}>{t("features:v1")}</h2>
        <span className={styles.priceDes}>
          {props.location ? (
            props.location === "Turkey" ? (
              <span className={styles.price}>1000₺</span>
            ) : (
              <span className={styles.price}>100€</span>
            )
          ) : (
            <Loading type="points-opacity" />
          )}

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
            {router.locale === "tr" ? (
              <img src={src} width="96px"></img>
            ) : (
              <img src={srcEn} width="96px"></img>
            )}
          </div>
        )}
        {isMobile && (
          <a
            href={
              router.locale === "tr"
                ? "https://www.digicafes.com/qr/v1/marcho-pascha-3"
                : "https://www.digicafes.com/qr/v1/demo-en2"
            }
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
            href={
              props.location ? (
                props.location === "Turkey" ? (
                  "https://iyzi.link/AIUgpA"
                ) : (
                  "https://iyzi.link/AIUo8w"
                )
              ) : (
                <Loading type="points-opacity" />
              )
            }
            rel="noreferrer"
            target="_blank"
          >
            {t("features:buy")}
          </a>
        ) : (
          <h4>{t("features:signIn")}</h4>
        )}
      </article>
      <article className={styles.article} data-aos="fade-left">
        <h2 className={styles.header}>{t("features:v2")}</h2>
        <span className={styles.priceDes}>
          {props.location ? (
            props.location === "Turkey" ? (
              <span className={styles.price}>2000₺</span>
            ) : (
              <span className={styles.price}>150€</span>
            )
          ) : (
            <Loading type="points-opacity" />
          )}

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
            {router.locale === "tr" ? (
              <img src={src2} width="96px"></img>
            ) : (
              <img src={src2En} width="96px"></img>
            )}
          </div>
        )}
        {isMobile && (
          <a
            href={
              router.locale === "tr"
                ? "https://www.digicafes.com/qr/v2/demo/1"
                : "https://www.digicafes.com/qr/v2/demo-en/1"
            }
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
            href={
              props.location ? (
                props.location === "Turkey" ? (
                  "https://iyzi.link/AIUgyw"
                ) : (
                  "https://iyzi.link/AIUpCw"
                )
              ) : (
                <Loading type="points-opacity" />
              )
            }
            rel="noreferrer"
            target="_blank"
          >
            {t("features:buy")}
          </a>
        ) : (
          <h4>{t("features:signIn")}</h4>
        )}
      </article>
    </section>
  );
};

export default Features;
