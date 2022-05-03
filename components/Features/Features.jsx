import { Button } from "@mui/material";
import React, { useEffect } from "react";
import styles from "./Features.module.css";
import QRCode from "qrcode";
import { useState } from "react";
import Aos from "aos";

const Features = () => {
  const [isMobile, setIsMobile] = useState();
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
  QRCode.toDataURL("https://www.digicafes.com/qr/v1/demo/", opts).then(setSrc);
  QRCode.toDataURL("https://www.digicafes.com/qr/v2/demo/1", opts).then(
    setSrc2
  );

  return (
    <section className={styles.section} data-aos="fade-up" id="paketler">
      <article className={styles.article} data-aos="fade-right">
        <h2 className={styles.header}>Dijital Menü V1</h2>
        <ul className={styles.list}>
          <li>Dijital Menü Yönetim Paneli</li>
          <li>Sınırsız Ürün ve Kategori Ekleme</li>
          <li>Sınırsız Güncelleme</li>
          <li>Otomatik QR Kod Oluşturucu</li>
          <li>Dijital Menü</li>
        </ul>
        <p className={styles.articleDesc}>
          Dijital Menü V1 ile müşterilerinize Dijital Menü deneyimi sunun.
        </p>
        {!isMobile && (
          <div className={styles.demo}>
            <h3 className={styles.demoHeader}>Demo</h3>
            <img src={src} width="96px"></img>
          </div>
        )}
        {isMobile && (
          <a
            href="https://www.digicafes.com/qr/v1/demo"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="contained"
              style={{
                width: "12rem",
                margin: "1rem",
                backgroundColor: "#c9184a",
              }}
            >
              Demo
            </Button>
          </a>
        )}
      </article>
      <article className={styles.article} data-aos="fade-left">
        <h2 className={styles.header}>Dijital Menü V2</h2>
        <ul className={styles.list}>
          <li>Dijital Menü Yönetim Paneli</li>
          <li>Sınırsız Ürün ve Kategori Ekleme</li>
          <li>Sınırsız Güncelleme</li>
          <li>Otomatik QR Kod Oluşturucu</li>
          <li>Dijital Menü</li>
          <li>Dijital Menü Sipariş Paneli</li>
          <li>Dijital Menü Sipariş Modülü</li>
          <li>Dijital Menü Garson Çağır ve Adisyon İste Modülü</li>
          <li>7 / 24 Canlı Destek</li>
        </ul>
        <p className={styles.articleDesc}>
          Dijital Menü V2 ile müşterilerinize Dijital Menü deneyimi sunarken
          aynı zamanda iş yükünüzü azaltın.
        </p>
        {!isMobile && (
          <div className={styles.demo}>
            <h3 className={styles.demoHeader}>Demo</h3>
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
                backgroundColor: "#c9184a",
              }}
            >
              Demo
            </Button>
          </a>
        )}
      </article>
    </section>
  );
};

export default Features;
