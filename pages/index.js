import Jumbotron from "../components/Jumbotron/Jumbotron";
import Navbar from "../components/NavBar/Navbar";
import styles from "../styles/Home.module.css";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Brand Name | Description</title>
      </Head>
      <div className={styles.container}>
        <Navbar />
        <Jumbotron />
      </div>
    </>
  );
}
