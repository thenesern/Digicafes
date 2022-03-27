import React from "react";
import SideBar from "../../../../components/Dashboard/SideBar/SideBar";
import UserProfile from "../../../../components/Dashboard/UserProfile/UserProfile";
import User from "../../../../models/UserModel";
import db from "../../../../utils/db";
import styles from "./profile.module.css";

const AdminUserProfile = ({ user }) => {
  return (
    <div className={styles.container}>
      <SideBar />
      <UserProfile user={user} />
    </div>
  );
};

export async function getStaticPaths() {
  await db.connect();
  const users = await User.find();
  await db.disconnect();
  return {
    paths: users.map((user) => {
      return {
        params: { id: JSON.parse(JSON.stringify(user._id)) },
      };
    }),
    fallback: false, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const user = await User.findById(params.id).lean();
  await db.disconnect();
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default AdminUserProfile;
