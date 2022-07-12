import React, { useContext } from "react";
import styles from "./PricingTable.module.css";
import { Store } from "../../../redux/store";

const PricingTable = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log(userInfo);
  return (
    <div id="paketler">
      <body>
        <div className={styles.container}>
          <div className={styles.column}>
            <div className={`${styles.pricingCard} ${styles.business}`}>
              <div className={styles.pricingHeader}>
                <span className={styles.planTitle}>
                  Online Rezervasyon Paketi
                </span>
                <div className={styles.priceCircle}>
                  <span className={styles.priceTitle}>
                    <small>₺</small>
                    <span>5000</span>
                  </span>
                  <span className={styles.info}>/ Yıl</span>
                </div>
              </div>
              <div className={styles.badgeBox}></div>
              <ul style={{ padding: "0 10px" }}>
                <li>Digicafes altında işletmenize özel web sayfası</li>
                <li>Rezervasyon Sistemi</li>
                <li>Kapora Modülü</li>
                <li>Rezervasyon izleme modülü</li>
                <li>Geçmiş rezervasyonlar silinmez</li>
                <li>Rezervasyonda SMS ve Email ile bilgilendirme</li>
              </ul>
              <div className={styles.buyButtonBox}>
                {userInfo ? (
                  <a
                    href={"/checkout/62bf17d63c33439aac11b362"}
                    className={styles.buyNow}
                  >
                    Satın Al
                  </a>
                ) : (
                  <p
                    style={{
                      backgroundColor: "#c9184a",
                      padding: "10px",
                      borderRadius: "2rem",
                      color: "#fff",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    Satın almak için giriş yapınız
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={`${styles.pricingCard} ${styles.pro}`}>
              <div className={styles.popular}>AVANTAJ PAKET</div>
              <div className={styles.pricingHeader}>
                <span className={styles.planTitle}>
                  Rezervasyon + Dijital Menü V1
                </span>
                <div className={styles.priceCircle}>
                  <span className={styles.priceTitle}>
                    <small>₺</small>
                    <span>5500</span>
                  </span>
                  <span className={styles.info}>/ Yıl</span>
                </div>
              </div>
              <div className={styles.badgeBox}>
                <span>%8 Daha Avantajlı</span>
              </div>
              <ul style={{ padding: "0 10px" }}>
                <li>Digicafes altında işletmenize özel web sayfası</li>
                <li>Rezervasyon Sistemi</li>
                <li>Kapora Modülü</li>
                <li>Rezervasyon izleme modülü</li>
                <li>Geçmiş rezervasyonlar silinmez</li>
                <li>Rezervasyonda SMS ve Email ile bilgilendirme</li>
                <li>+</li>
                <li>Dijital Menü V1</li>
              </ul>
              <div className={styles.buyButtonBox}>
                {userInfo ? (
                  <a href="" className={styles.buyNow}>
                    Satın Al
                  </a>
                ) : (
                  <p
                    style={{
                      backgroundColor: "#c9184a",
                      padding: "10px",
                      borderRadius: "2rem",
                      color: "#fff",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    Satın almak için giriş yapınız
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={`${styles.pricingCard} ${styles.pro}`}>
              <div className={styles.popular}>AVANTAJ PAKET</div>
              <div className={styles.pricingHeader}>
                <span className={styles.planTitle}>
                  Rezervasyon + Dijital Menü V2
                </span>
                <div className={styles.priceCircle}>
                  <span className={styles.priceTitle}>
                    <small>₺</small>
                    <span>6500</span>
                  </span>
                  <span className={styles.info}>/ Yıl</span>
                </div>
              </div>
              <div className={styles.badgeBox}>
                <span>%18 Daha Avantajlı</span>
              </div>
              <ul style={{ padding: "0 10px" }}>
                <li>Digicafes altında işletmenize özel web sayfası</li>
                <li>Rezervasyon Sistemi</li>
                <li>Kapora Modülü</li>
                <li>Rezervasyon izleme modülü</li>
                <li>Geçmiş rezervasyonlar silinmez</li>
                <li>Rezervasyonda SMS ve Email ile bilgilendirme</li>
                <li>+</li>
                <li>Dijital Menü V2</li>
              </ul>
              <div className={styles.buyButtonBox}>
                {userInfo ? (
                  <a href="" className={styles.buyNow}>
                    Satın Al
                  </a>
                ) : (
                  <p
                    style={{
                      backgroundColor: "#c9184a",
                      padding: "10px",
                      borderRadius: "2rem",
                      color: "#fff",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    Satın almak için giriş yapınız
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

export default PricingTable;
