// Packages and Dependencies
import React from "react";
// Components
import SideBar from "../../../../components/Admin/Dashboard/SideBar/SideBar";
import UserTable from "../../../../components/Admin/Dashboard/UserTable/UserTable";
// Utils
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
// Styles
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

export async function getServerSideProps() {
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
