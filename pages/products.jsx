import React from "react";
import styles from "./products.module.css";
import Image from "next/image";
import Product1 from "../assets/image/product1.png";
import Product2 from "../assets/image/product2.png";
import { Button } from "@mui/material";
import Link from "next/link";
const Products = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>İşletmeler için</h1>
      <div className={styles.products}>
        <Link href="/booking" passHref>
          <div className={styles.wrappers}>
            <div className={styles.image}>
              <Image
                src={Product1}
                className={styles.images}
                width="300"
                height="300"
                alt="Online Booking"
              />
            </div>
            <h3 className={styles.headers}>Online Rezervasyon Sistemi</h3>
          </div>
        </Link>
        <Link href="/digital-menu" passHref>
          <div className={styles.wrappers}>
            <div className={styles.image}>
              <Image
                src={Product2}
                className={styles.images}
                width="300"
                height="300"
                alt="Digital (QR) Menu"
              />
            </div>
            <h3 className={styles.headers}>Dijital (QR) Menü Sistemi</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Products;
