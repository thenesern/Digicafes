import React from "react";
import styles from "./Component404.module.css";

const Component404 = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.top}>404</h1>
      <h1 className={styles.bottom}>
        Aradığınız sayfaya ulaşılamıyor ya da erişim izniniz yok!
      </h1>
    </div>
  );
};

export default Component404;
