import React from "react";
import styles from "./Component404.module.css";
import useTranslation from "next-translate/useTranslation";

const Component404 = () => {
  // Translation
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.top}>404</h1>
      <h1 className={styles.bottom}>{t("common:404")}</h1>
    </div>
  );
};

export default Component404;
