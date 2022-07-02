import React from "react";
import styles from "./BookingDashboard.module.css";

const BookingDashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}></div>
      <div className={styles.app}></div>
    </div>
  );
};

export default BookingDashboard;
