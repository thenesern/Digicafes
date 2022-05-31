// Packages and Dependencies
import React from "react";
// Components
import ProductTable from "../../../../components/Dashboard/ProductTable/ProductTable";
import SideBar from "../../../../components/Dashboard/SideBar/SideBar";
// Utils
import Product from "../../../../models/ProductModel";
import db from "../../../../utils/db";
// Styles
import styles from "./products.module.css";

const products = ({ products }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div>
        <ProductTable products={products} />
      </div>
    </div>
  );
};

export async function getStaticProps() {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default products;
