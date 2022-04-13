import React from "react";
import DigitalMenuPage from "../components/DigitalMenuPage/DigitalMenuPage";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
import Product from "../models/ProductModel";
import db from "../utils/db";

export const config = {
  unstable_runtimeJS: false,
};
const DijitalMenu = ({ products }) => {
  return (
    <div>
      <Nav />
      <div>
        <DigitalMenuPage products={products} />
      </div>
      <Footer />
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

export default DijitalMenu;
