import React from "react";
import OrderTable from "../../../../components/Dashboard/OrderTable/OrderTable";
import SideBar from "../../../../components/Dashboard/SideBar/SideBar";
import Order from "../../../../models/OrderModel";
import db from "../../../../utils/db";
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
  const orders = await Order.find();
  await db.disconnect();
  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default orders;
