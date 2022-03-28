import React from "react";
import styles from "./DigitalMenuPlans.module.css";
import axios from "axios";

const DigitalMenuPlans = () => {
  const paymentHandler = async () => {
    try {
      await axios.post("/api/payments");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles["pricingTable"]}>
      <h3 className={styles["pricingTable-subtitle"]}>
        Bütün Planlar 30 Gün Deneme Sürümü İçerir
      </h3>

      <ul className={styles["pricingTable-firstTable"]}>
        <li className={styles["pricingTable-firstTable_table"]}>
          <h1 className={styles["pricingTable-firstTable_table__header"]}>
            Başlangıç
          </h1>
          <p className={styles["pricingTable-firstTable_table__pricing"]}>
            <span>₺</span>
            <span>*</span>
            <span>/ Ay</span>
          </p>
          <ul className={styles["pricingTable-firstTable_table__options"]}>
            <li>Sınırsız Ürün Modülü</li>
            <li>Özel Yönetim Paneli</li>
          </ul>
          <button
            className={styles["pricingTable-firstTable_table__getstart"]}
            onClick={paymentHandler}
          >
            Hemen Başlayın
          </button>
        </li>
        <li className={styles["pricingTable-firstTable_table"]}>
          <h1 className={styles["pricingTable-firstTable_table__header"]}>
            Profesyonel
          </h1>
          <p className={styles["pricingTable-firstTable_table__pricing"]}>
            <span>₺</span>
            <span>*</span>
            <span>/ Ay</span>
          </p>
          <ul className={styles["pricingTable-firstTable_table__options"]}>
            <li>Sınırsız Ürün Modülü</li>
            <li>Özel Yönetim Paneli</li>
            <li>7/24 Canlı Destek</li>
            ...
          </ul>
          <button className={styles["pricingTable-firstTable_table__getstart"]}>
            Hemen Başlayın
          </button>
        </li>
        <li className={styles["pricingTable-firstTable_table"]}>
          <h1 className={styles["pricingTable-firstTable_table__header"]}>
            Yakında
          </h1>
          <p className={styles["pricingTable-firstTable_table__pricing"]}>
            <span>₺</span>
            <span>*</span>
            <span>Ay</span>
          </p>
          <ul className={styles["pricingTable-firstTable_table__options"]}>
            <li>Sınırsız Ürün Modülü</li>
            <li>Özel Yönetim Paneli</li>
            <li>7/24 Canlı Destek</li>
          </ul>
          <button
            disabled
            className={styles["pricingTable-firstTable_table__getstart"]}
          >
            Hemen Başlayın
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DigitalMenuPlans;
