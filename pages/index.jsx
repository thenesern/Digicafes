import Jumbotron from "../components/Jumbotron/Jumbotron";
import styles from "../styles/Home.module.css";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Brand Name | Ana Sayfa</title>
        <meta name="description" content="Descriptions" />
      </Head>
      <div className={styles.container}>
        <Jumbotron />
      </div>
    </>
  );
}
