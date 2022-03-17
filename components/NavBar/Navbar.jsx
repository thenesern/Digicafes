import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.left}>
          <h6 className={styles.logo}>Logo</h6>
          <div className={styles.headers}>
            <p>Özellikler</p>
            <p>Fiyatlar</p>
          </div>
        </li>

        <li className={styles.right}>
          <button className={styles.signIn}>Giriş Yap</button>
          <button className={styles.signUp}>Üye Ol </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
