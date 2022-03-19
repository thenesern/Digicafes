import React from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <navbar className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.left}>
          <h6 className={styles.logo}>Logo</h6>
          <div className={styles.headers}>
            <p>Çözümlerimiz</p>
          </div>
        </li>

        <li className={styles.right}>
          <button className={styles.signIn}>Giriş Yap</button>
          <button className={styles.signUp}>
            <Link href="/register">Üye Ol </Link>
          </button>
        </li>
      </ul>
    </navbar>
  );
};

export default Navbar;
