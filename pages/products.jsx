import React from "react";
import styles from "./products.module.css";
import Image from "next/image";
import qrMenuIcon from "../assets/Icons/qrMenuIcon.png";
import reservedTable from "../assets/Icons/reservedTable.png";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
const Products = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>İşletmeler için</h1>

      <div className={styles.products}>
        <Link href="/booking" passHref>
          <div className={styles.wrapper1}>
            <div className={styles.image}>
              <Image
                src={reservedTable}
                className={styles.images}
                width="300"
                height="300"
                alt="Online Booking"
              />
              <ArrowBackIosNewIcon className={styles.arrowLeft} />
            </div>
            <h3 className={styles.headers}>Online Rezervasyon Sistemi</h3>
          </div>
        </Link>
        <Link href="/digital-menu" passHref>
          <div className={styles.wrapper2}>
            <div className={styles.image}>
              <Image
                src={qrMenuIcon}
                className={styles.images}
                width="300"
                height="300"
                alt="Digital (QR) Menu"
              />
              <ArrowForwardIosIcon className={styles.arrowRight} />
            </div>
            <h3 className={styles.headers}>Dijital (QR) Menü Sistemi</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Products;
