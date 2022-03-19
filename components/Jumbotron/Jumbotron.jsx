import Image from "next/image";
import React from "react";
import styles from "./Jumbotron.module.css";
import illustration from "../../assets/image/jumbotron-image.svg";
import TextTransition, { presets } from "react-text-transition";
import MainMenuButton from "../MainMenuButton/Button";

const TEXTS = [
  "Profesyonel Logo Tasarımı",
  "Yeni Nesil Dijital Menü",
  "E-Ticaret Çözümleri",
];

const Jumbotron = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <TextTransition
          text={TEXTS[index % TEXTS.length]}
          springConfig={{ stiffness: 50, damping: 20 }}
          className={styles.header}
          noOverflow
          inline={true}
          style={{
            width: "auto",
          }}
        />
        <MainMenuButton>Hemen Başlayın</MainMenuButton>
      </div>
    </div>
  );
};

export default Jumbotron;
