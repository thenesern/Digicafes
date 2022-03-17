import Image from "next/image";
import React from "react";
import styles from "./Jumbotron.module.css";
import illustration from "../../assets/image/jumbotron-image.svg";
import TextTransition, { presets } from "react-text-transition";

const TEXTS = [
  "Profesyonel Logo Tasarımı",
  "Yeni Nesil Dijital Menü",
  "Özel Portfolyo Sitesi",
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
      <div className={styles.left}>
        <TextTransition
          text={TEXTS[index % TEXTS.length]}
          springConfig={presets.wobbly}
          className={styles.header}
          inline="true"
        />
        <button className={styles.button}>Hemen Başlayın</button>
      </div>
      <div className={styles.right}>
        <Image
          className={styles.image}
          src={illustration}
          alt="image"
          width="600px"
          height="600px"
        />
      </div>
    </div>
  );
};

export default Jumbotron;
