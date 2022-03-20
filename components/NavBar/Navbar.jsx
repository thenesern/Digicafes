import React from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <navbar className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.left}>
          <Link href="/" passHref>
            <h6 className={styles.logo}>Logo</h6>
          </Link>
          <div className={styles.headers}>
            <Link href="/services">Çözümlerimiz</Link>
          </div>
        </li>

        <li className={styles.right}>
          <button className={styles.signIn}>Giriş Yap</button>
          <Link href="/register" passHref>
            <button className={styles.signUp}>Üye Ol</button>
          </Link>
        </li>
      </ul>
    </navbar>
  );
};

export default Navbar;
