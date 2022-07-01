import React from "react";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
import SearchBar from "../components/SearchBar/SearchBar";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <SearchBar />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
