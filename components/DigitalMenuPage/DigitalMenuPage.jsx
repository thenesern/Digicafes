import React from "react";
import styles from "./DigitalMenuPage.module.css";

const DigitalMenuPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <h1 className={styles.header}>Dijital Menü</h1>
          <p>
            Yönetim Paneliniz üzerinden Menünüzü düzenleyin ve hemen kullanmaya
            başlayın.
          </p>
        </div>
        <div>
          <img src="" alt="" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default DigitalMenuPage;
