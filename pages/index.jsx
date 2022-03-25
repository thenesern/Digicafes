import Jumbotron from "../components/Jumbotron/Jumbotron";
import Head from "next/head";
import Nav from "../components/Nav/Nav";
import DigitalMenuHome from "../components/DigitalMenuHome/DigitalMenuHome";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Brand Name | Ana Sayfa</title>
        <meta name="description" content="Descriptions" />
      </Head>
      <Nav />
      <Jumbotron />
      <DigitalMenuHome />

      <Footer />
    </div>
  );
}
