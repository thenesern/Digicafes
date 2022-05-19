import React from "react";
import Footer from "../../components/Footer/Footer";
import Nav from "../../components/Nav2/Nav";
import styles from "./expired.module.css";

const expired = () => {
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
        <h3 className={styles.text}>
          Şifrenizi yenilemeniz için mail adresinize gönderilen link geçerlilik
          süresini doldurdu.
        </h3>
      </div>
      <Footer />
    </div>
  );
};

export default expired;
