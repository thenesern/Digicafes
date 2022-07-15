import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";

const Search = () => {
  const [stores, setStores] = useState([]);
  console.log(stores);
  useEffect(() => {
    const getStores = async () => {
      try {
        const result = await axios.get("/api/booking");
        setStores(result.data.bookings);
      } catch (err) {
        console.log(err);
      }
    };
    getStores();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.left}>a</div>
      <div className={styles.right}>as</div>
    </div>
  );
};

export default Search;
