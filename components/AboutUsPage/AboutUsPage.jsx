import React from "react";
import styles from "./AboutUsPage.module.css";

const AboutUsPage = () => {
  return (
    <div className={styles.container}>
      <h1 align="center" style={{ color: "#000814" }}>
        Hakkımızda
      </h1>
      <section className={styles.articles}>
        <article>
          <p align="center">
            Digicafes, genç ve dinamik ekibiyle birlikte Kafe, Restoran ve
            Oteller için &quot;Dijital Çözümler&quot; üretmek için 2022&apos;de
            faaliyetlerini başlatmıştır.
          </p>
        </article>
        <article className={styles.visionMission}>
          <div>
            <h3 align="center" style={{ color: "#000814" }}>
              Vizyon
            </h3>
            <p align="center">
              Dijital Ürün geliştirmede sürekli özgünü yaratan, çalışanları,
              müşteri ve tedarikçileri ile bütünleşmeyi amaçlayan, uluslararası
              kalite standart ve imajına sahip olmayı vizyon edinmiştir.
            </p>
          </div>
          <div>
            <h3 align="center" style={{ color: "#000814" }}>
              Misyon
            </h3>
            <p align="center">
              Bugün ulaşılan başarılı konumunu sürekli geliştirerek, faaliyet
              alanında en iyi olmak; deneyimli, dinamik ve yetkin kadrosuyla,
              girişimci, sağduyulu ve müşteri odaklı yaklaşımıyla kaliteli ürün
              üretmektir.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
};

export default AboutUsPage;
