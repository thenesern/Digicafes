import React from "react";
import SideBar from "../../components/Dashboard/SideBar/SideBar";
import Nav from "../../components/Nav/Nav";
import styles from "./panel.module.css";

const panel = () => {
  return (
    <div className={styles.container}>
      <SideBar />
    </div>
  );
};

export default panel;
