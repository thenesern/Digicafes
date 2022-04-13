import React from "react";
import DigitalMenuPrices from "./DigitalMenuPlans/DigitalMenuPlans";
import styles from "./DigitalMenuPage.module.css";
import DigitalMenuStepper from "./DigitalMenuStepper/DigitalMenuStepper";
import StepperMobile from "./StepperMobile/StepperMobile";
import LinkRouter from "next/link";
import Footer from "../Footer/Footer";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-scroll";

const DigitalMenuPage = ({ products }) => {
  const [isMobile, setIsMobile] = useState();
  useEffect(() => {
    if (window.innerWidth <= 760) {
      setIsMobile(true);
    }
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <h1 className={styles.header}>Dijital Menü</h1>
          <p className={styles.description}>Baskı Maliyetlerinden Kurtulun</p>
          <Link
            to="pricing"
            spy={true}
            smooth={true}
            offset={-80}
            duration={200}
          >
            <button className={styles.buttonFirst}>
              <span className={styles.circle} aria-hidden="true">
                <span className={`${styles.icon} ${styles.arrow}`}></span>
              </span>
              <span className={styles.text}>Hemen Başlayın</span>
            </button>
          </Link>
        </div>
        <div className={styles.images}>
          <img
            lazyOnload
            src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/DigitalMenuPanelMockup.png"
            alt=""
            className={styles.image}
          />
          <img
            lazyOnload
            src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
            alt=""
            className={styles.image2}
          />
        </div>
      </div>
      <section className={styles.section}>
        <h3 className={styles.articleHeader} id="features">
          Özellikler
        </h3>
        <article className={styles.first}>
          <div>
            <img
              lazyOnload
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
              <li>Çoklu Dil Desteği</li>
            </ul>
            <p>
              Dijital Menü, Kullanıcı Deneyimine odaklı tasarımı sayesinde
              müşteri memnuniyetini artırır.
            </p>
            <LinkRouter href="/qr/v1/demo" passHref>
              <button className={styles.button}>Demo&apos;yu İncele</button>
            </LinkRouter>
          </div>
          <div>
            <img
              lazyOnload
              src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
              alt=""
              className={styles.secondImage}
            />
          </div>
        </article>
        <h3 className={styles.articleHeader} id="process">
          İşleyiş
        </h3>
        <article className={styles.steps}>
          <div className={styles.stepper}>
            <DigitalMenuStepper />
          </div>
        </article>
        {isMobile && (
          <h3 className={styles.articleHeaderMobile} id="pricing1">
            Fiyatlandırma
          </h3>
        )}
        <article>
          <div className={styles.stepperMobile}>
            <StepperMobile />
          </div>
        </article>
        <h3 className={styles.articleHeader} id="pricing">
          Fiyatlandırma
        </h3>
        <article>
          <div>
            <DigitalMenuPrices products={products} />
          </div>
        </article>
        <h3 className={styles.articleHeader} id="faq">
          Sıkça Sorulan Sorular
        </h3>
        <h3 className={styles.articleHeader} id="contact">
          İletişim
        </h3>
      </section>
    </div>
  );
};

export default DigitalMenuPage;
