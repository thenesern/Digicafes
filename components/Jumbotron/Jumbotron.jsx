import Image from "next/image";
import React from "react";
import styles from "./Jumbotron.module.css";
import illustration from "../../assets/image/qr-menu.svg";

const Jumbotron = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>Yeni Nesil Dijital Menü</h1>
        <p className={styles.subHeader}>Baskı maliyetlerinden kurtulun.</p>
        <button className={styles.button}>Hemen Başlayın</button>
      </div>
      <div className={styles.right}>
        <Image
          className={styles.image}
          src={illustration}
          alt="image"
          width="600px"
          height="600px"
        />
      </div>
    </div>
  );
};

export default Jumbotron;
