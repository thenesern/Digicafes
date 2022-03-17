import Jumbotron from "../components/Jumbotron/Jumbotron";
import Navbar from "../components/NavBar/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <Jumbotron />
    </div>
  );
}
