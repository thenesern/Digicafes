import React from "react";
import SideBar from "../../components/Dashboard/SideBar/SideBar";
import Widget from "../../components/Dashboard/Widget/Widget";
import Nav from "../../components/Nav/Nav";
import User from "../../models/UserModel";
import db from "../../utils/db";
import styles from "./panel.module.css";

const panel = ({ users }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.widgets}>
        <Widget type="users" users={users} />
        <Widget type="orders" />
        <Widget type="earnings" />
        <Widget type="products" />
      </div>
    </div>
  );
};
export async function getStaticProps() {
  await db.connect();
  const users = await User.find();
  await db.disconnect();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users.length)),
    },
  };
}

export default panel;
