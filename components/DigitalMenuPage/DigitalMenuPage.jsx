import React from "react";
import DigitalMenuPrices from "./DigitalMenuPlans/DigitalMenuPlans";
import styles from "./DigitalMenuPage.module.css";
import DigitalMenuStepper from "./DigitalMenuStepper/DigitalMenuStepper";

const DigitalMenuPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <h1 className={styles.header}>Dijital Menü</h1>
          <p className={styles.description}>
            Yönetim Paneliniz üzerinden Menünüzü düzenleyin ve hemen kullanmaya
            başlayın.
          </p>
        </div>
        <div className={styles.images}>
          <img
            src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/DigitalMenuPanelMockup.png"
            alt=""
            className={styles.image}
          />
          <img
            src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
            alt=""
            className={styles.image2}
          />
        </div>
      </div>
      <section className={styles.section}>
        <article className={styles.first}>
          <div>
            <img
              src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/DigitalMenuPanelMockup.png"
              alt=""
              className={styles.firstImage}
            />
          </div>
          <div className={styles.firstDes}>
            <h2 className={styles.firstHeader}>Dijital Menü Yönetim Paneli</h2>
            <ul className={styles.firstList}>
              <li>İş Yerinize Özel Alt Alan Adı</li>
              <li>Ürün Ekleme, Çıkarma ve Güncelleme Modülü</li>
              <li>QR Kod Oluşturma Modülü</li>
            </ul>
            <p>
              Dijital Menü Yönetim Paneli üzerinden Menünüzü dilediğiniz şekilde
              düzenleyebilirsiniz.
            </p>
          </div>
        </article>
        <article className={styles.second}>
          <div className={styles.secondDes}>
            <h2 className={styles.secondHeader}>Dijital Menü</h2>
            <ul className={styles.secondList}>
              <li>Ergonomik Menü Tasarımı</li>
              <li>Çoğu Akıllı Telefon Üzerinden Kolayca Ulaşılabilir</li>
              <li>
                Temassız Teknolojisi Sayesinde Salgın Hastalıklardan Korunma
                Avantajı
              </li>
              <li>Çoklu Dil Desteği</li>
            </ul>
            <p>
              Dijital Menü, Kullanıcı Deneyimine odaklı tasarımı sayesinde
              müşteri memnuniyetini artırır.
            </p>
          </div>
          <div>
            <img
              src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
              alt=""
              className={styles.secondImage}
            />
          </div>
        </article>
        <article>
          <div>
            <DigitalMenuStepper />
          </div>
        </article>
        <article>
          <div>
            <DigitalMenuPrices />
          </div>
        </article>
      </section>
    </div>
  );
};

export default DigitalMenuPage;
