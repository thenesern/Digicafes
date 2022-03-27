import React from "react";
import SideBar from "../../../../components/Dashboard/SideBar/SideBar";
import UserTable from "../../../../components/Dashboard/UserTable/UserTable";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
import styles from "./users.module.css";

const users = ({ users }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div>
        <UserTable users={users} />
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
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}

export default users;
