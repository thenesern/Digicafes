import React from "react";
import SideBar from "../../../components/Dashboard/SideBar/SideBar";
import Widget from "../../../components/Dashboard/Widget/Widget";
import Order from "../../../models/OrderModel";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import styles from "./panel.module.css";

const panel = ({ users, orders, products }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.widgets}>
        <Widget type="users" users={users} />
        <Widget type="orders" orders={orders} />
        <Widget type="products" products={products} />
        <Widget type="earnings" />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const users = await User.find();
  const orders = await Order.find();
  const products = await Product.find();
  await db.disconnect();

  return {
    props: {
      users: JSON.parse(
        JSON.stringify(users.filter((user) => user.isAdmin === false).length)
      ),
      orders: JSON.parse(JSON.stringify(orders.length)),
      products: JSON.parse(JSON.stringify(products.length)),
    },
  };
}

export default panel;
