import React from "react";
import Footer from "../../components/Footer/Footer";
import Nav from "../../components/Nav2/Nav";
import styles from "./expired.module.css";
import useTranslation from "next-translate/useTranslation";

const Expired = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Nav />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
        }}
      >
        <h3 className={styles.text}>{t("common:expired")}</h3>
      </div>
      <Footer />
    </div>
  );
};

export default Expired;
