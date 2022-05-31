// Packages and Dependencies
import React from "react";
// Components
import OrderTable from "../../../../components/Dashboard/OrderTable/OrderTable";
import SideBar from "../../../../components/Dashboard/SideBar/SideBar";
// Utils
import Order from "../../../../models/OrderModel";
import Product from "../../../../models/ProductModel";
import QRMenu1 from "../../../../models/QRMenu1Model";
import QRMenu2 from "../../../../models/QRMenu2Model";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
// Styles
import styles from "./orders.module.css";

const orders = ({ orders }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div>
        <OrderTable orders={orders} />
      </div>
    </div>
  );
};

export async function getStaticProps() {
  await db.connect();
  const orders = await Order.find()
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User })
    .populate({ path: "menuv1", model: QRMenu1 })
    .populate({ path: "menuv2", model: QRMenu2 });
  await db.disconnect();
  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default orders;
