import React from "react";
import styles from "./DigitalMenuPlans.module.css";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

const DigitalMenuPlans = ({ products }) => {
  const items = products.sort(function (a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  return (
    <div className={styles["pricingTable"]}>
      <h3 className={styles["pricingTable-subtitle"]}>
        Bütün Planlar 30 Gün Deneme Sürümü İçerir
      </h3>

      <ul className={styles["pricingTable-firstTable"]}>
        {items?.map((product) => (
          <li
            key={product?._id}
            className={styles["pricingTable-firstTable_table"]}
          >
            <h1 className={styles["pricingTable-firstTable_table__header"]}>
              {product?.name}
            </h1>
            <p className={styles["pricingTable-firstTable_table__pricing"]}>
              <span>₺</span>
              <span>{product.price}</span>
              <span>/ {product.period}</span>
            </p>
            <ul className={styles["pricingTable-firstTable_table__options"]}>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link href={"/checkout/" + `${product._id}`} passHref>
              <button
                className={styles["pricingTable-firstTable_table__getstart"]}
              >
                Hemen Başlayın
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DigitalMenuPlans;
