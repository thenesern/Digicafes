import Jumbotron from "../components/Jumbotron/Jumbotron";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../components/NavBar/Navbar";
import QRMenuDescription from "../components/QRMenuDescription/QRMenuDescription";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Head>
        <title>Brand Name | Ana Sayfa</title>
        <meta name="description" content="Descriptions" />
      </Head>
      <div className={styles.container}>
        <Jumbotron />
        <QRMenuDescription />
      </div>
      <Footer />
    </>
  );
}
