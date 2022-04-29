// Packages and Dependencies
import React, { useEffect, useState } from "react";
import DigitalMenuStepper from "./DigitalMenuStepper/DigitalMenuStepper";
import StepperMobile from "./StepperMobile/StepperMobile";
import LinkRouter from "next/link";
import { Link } from "react-scroll";
import QRMenuMockup from "../../assets/image/QRMenuMockup.png";
import TabletMockup from "../../assets/image/tabletMockup.png";
import FAQ from "../FAQ/FAQ";
import ContactForm from "../ContactForm/ContactForm";
import digitalMenuMockup from "../../assets/image/DigitalMenuPanelMockup.png";
import Image from "next/image";
// Styles
import styles from "./DigitalMenuPage.module.css";

const DigitalMenuPage = () => {
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
        <h3 className={styles.articleHeader} id="features">
          Özellikler
        </h3>
        <article className={styles.first}>
          <div
            style={{ width: "48rem", height: "auto" }}
            className={styles.featuresImage1}
          >
            <Image
              layout="responsive"
              objectFit="contain"
              src={digitalMenuMockup}
              alt=""
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
          <div className={styles.featuresImage2}>
            <Image
              src={QRMenuMockup}
              alt=""
              layout="responsive"
              objectFit="contain"
            />
          </div>
        </article>
        <article className={styles.third}>
          <div
            style={{ width: "20rem", height: "auto" }}
            className={styles.featureImage3}
          >
            <Image
              layout="responsive"
              objectFit="contain"
              src={TabletMockup}
              alt=""
            />
          </div>
          <div className={styles.thirdDes}>
            <h2 className={styles.thirdHeader}>Dijital Menü Sipariş Paneli</h2>
            <ul className={styles.thirdList}>
              <li>İş Yerinin Sipariş Performansı Modülü</li>
              <li>Sipariş ve Çağrı Modülleri</li>
            </ul>
            <p>
              Dijital Menü Sipariş Paneli ile birlikte müşteri tarafından gelen
              siparişleri ve çağrıları anlık olarak görebilir. İş yerinizin
              sipariş performansını ve en sevilen ürünlerinizi
              görüntüleyebilirsiniz.
            </p>
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

        <article>
          <div className={styles.stepperMobile}>
            <StepperMobile />
          </div>
        </article>

        <article>
          <div></div>
        </article>
        <h3 className={styles.articleHeader} id="faq">
          Sıkça Sorulan Sorular
        </h3>
        <FAQ />
        <ContactForm />
      </section>
    </div>
  );
};

export default DigitalMenuPage;
