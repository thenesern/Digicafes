import React from "react";
import styles from "./QRMenuDescription.module.css";

const QRMenuDescription = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
          alt="QR Menü Mockup"
          className={styles.image}
        />
      </div>
      <div className={styles.right}>
        <h1 className={styles.header}>Baskı Maliyetlerinden Kurtulun</h1>
        <ul className={styles.list}>
          <li>
            <h5 className={styles.title}>Menünüz her zaman elinizin altında</h5>
            <p>
              Dijital Menü Yönetim Paneli ile menünüzü kolayca
              düzenleyebilirsiniz.
            </p>
          </li>
          <li>
            <h5 className={styles.title}>Kolay Erişim</h5>
            <p>Sadece QR Kodunu okutarak, menüye ulaşın.</p>
          </li>
          <li>
            <button className={styles.button}>
              <span className={styles.btnText}>Hemen Başlayın</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QRMenuDescription;
