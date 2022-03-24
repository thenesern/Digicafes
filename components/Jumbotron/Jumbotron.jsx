import React, { useState, useEffect } from "react";
import styles from "./Jumbotron.module.css";
import TextTransition, { presets } from "react-text-transition";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const TEXTS = [
  "Sosyal Medya Yönetimi",
  "Yeni Nesil Dijital Menü",
  "E-Ticaret Çözümleri",
];

const Jumbotron = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <TextTransition
          text={TEXTS[index % TEXTS.length]}
          springConfig={{ stiffness: 50, damping: 20 }}
          className={styles.header}
          noOverflow
          inline={true}
          style={{
            width: "auto",
          }}
        />
        <button
          className={styles.button}
          onClick={() => router.push("/dijital-menu")}
        >
          <span className={styles.circle} aria-hidden="true">
            <span className={`${styles.icon} ${styles.arrow}`}></span>
          </span>
          <span className={styles.text}>Hemen Başlayın</span>
        </button>
      </div>
    </div>
  );
};

export default Jumbotron;
