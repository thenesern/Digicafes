import React from "react";
import styles from "./StoreBookingShowcase.module.css";

const StoreBookingShowcase = ({ store }) => {
  console.log(store);
  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.left}>
          <h1 className={styles.storeName}>{store?.storeName}</h1>
          <p className={styles.city}>Çankaya / Ankara</p>
        </div>
        <div className={styles.right}>asdasd</div>
      </div>
    </div>
  );
};

export default StoreBookingShowcase;
