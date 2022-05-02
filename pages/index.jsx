import React from "react";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
// Packages and Dependencies
import LinkRouter from "next/link";
import { Link } from "react-scroll";
import Image from "next/image";
import digitalMenuMockup from "../assets/image/DigitalMenuPanelMockup.png";
import TabletMockup from "../assets/image/tabletMockup.png";
import QRMenuMockup from "../assets/image/QRMenuMockup.png";
import DigitalMenuStepper from "../components/DigitalMenuPage/DigitalMenuStepper/DigitalMenuStepper";
import StepperMobile from "../components/DigitalMenuPage/StepperMobile/StepperMobile";
import FAQ from "../components/FAQ/FAQ";
import ContactForm from "../components/ContactForm/ContactForm";
// Styles
import styles from "./DigitalMenuPage.module.css";
import Aos from "aos";
import { useEffect } from "react";
import { useState } from "react";
import "aos/dist/aos.css";
const DijitalMenu = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
    Aos.refresh();
  }, []);
  const [isMobile, setIsMobile] = useState();
  useEffect(() => {
    if (window.innerWidth <= 760) {
      setIsMobile(true);
    }
  }, []);
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <h1 className={styles.header}>Dijital Menü</h1>
            <p className={styles.description}>Baskı Maliyetlerinden Kurtulun</p>
            <Link
              data-aos-delay="600"
              to="pricing"
              data-aos="fade-right"
              spy={true}
              smooth={true}
              offset={-80}
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
              data-aos="fade-left"
              src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/tabletMockup.png"
              alt=""
              className={styles.image2}
            />
            <img
              data-aos="fade-right"
              src="https://raw.githubusercontent.com/thenesern/project/master/assets/image/QRMenuMockup.png"
              alt=""
              className={styles.image3}
            />
          </div>
        </div>
        <section className={styles.section} data-aos="fade-up">
          <h3 className={styles.articleHeader} id="features">
            Özellikler
          </h3>
          <article className={styles.first}>
            <div
              style={{ width: "40rem", height: "auto" }}
              className={styles.featuresImage1}
            >
              <Image
                layout="responsive"
                objectFit="contain"
                src={digitalMenuMockup}
                alt=""
              />
            </div>

            <div data-aos="fade-up" className={styles.firstDes}>
              <h2 className={styles.firstHeader}>
                Dijital Menü Yönetim Paneli
              </h2>
              <ul className={styles.firstList}>
                <li>Sınırsız Ürün ve Kategori Modülü</li>
                <li>Sınırsız Güncelleme Modülü</li>
                <li>Otomatik QR Kod Oluşturma Modülü</li>
              </ul>
              <p>
                Dijital Menü Yönetim Paneli üzerinden Menünüzü dilediğiniz
                zaman, dilediğiniz şekilde düzenleyebilirsiniz.
              </p>
            </div>
          </article>

          <article className={styles.second}>
            <div className={styles.secondDes}>
              <h2 className={styles.secondHeader}>
                Dijital Menü Sipariş Paneli
              </h2>
              <ul className={styles.secondList}>
                <li>Günlük, Haftalık ve Aylık Sipariş Performansı Modülü</li>
                <li>Sipariş ve Çağrı Görüntüleme Modülleri</li>
              </ul>
              <p>
                Dijital Menü Sipariş Paneli ile birlikte müşteri tarafından
                gelen siparişleri ve çağrıları anlık olarak görebilir. İş
                yerinizin sipariş performansını ve en sevilen ürünlerinizi
                görüntüleyebilirsiniz.
              </p>
            </div>
            <div
              style={{ width: "18rem", height: "auto" }}
              className={styles.featuresImage2}
            >
              <Image
                layout="responsive"
                objectFit="contain"
                src={TabletMockup}
                data-aos="fade-left"
                alt=""
              />
            </div>
          </article>
          <article className={styles.third}>
            {" "}
            <div
              className={styles.featuresImage3}
              style={{ width: "12rem", height: "auto" }}
            >
              <Image
                src={QRMenuMockup}
                alt=""
                layout="responsive"
                data-aos="fade-right"
                objectFit="contain"
              />
            </div>
            <div className={styles.thirdDes}>
              <h2 className={styles.thirdHeader}>Dijital Menü</h2>
              <ul className={styles.thirdList}>
                <li>Sepete Ürün Ekleme Modülü</li>
                <li>Garson Çağır ve Adisyon İste Modülleri</li>
              </ul>
              <p>
                Dijital Menü, Kullanıcı Deneyimine odaklı tasarımı sayesinde
                müşteri memnuniyetini artırır.
              </p>
            </div>
          </article>
          <h3 className={styles.articleHeader} id="process">
            İşleyiş
          </h3>
          <article className={styles.steps} data-aos="fade-up">
            <div className={styles.stepper}>
              <DigitalMenuStepper />
            </div>
          </article>

          <article>
            <div className={styles.stepperMobile} data-aos="fade-up">
              <StepperMobile />
            </div>
          </article>

          <article>
            <div></div>
          </article>
          <h3 className={styles.articleHeader} id="faq">
            Sıkça Sorulan Sorular
          </h3>
          <div data-aos="fade-up">
            <FAQ />
          </div>
          <div data-aos="fade-up" style={{ width: "100%" }}>
            <ContactForm />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DijitalMenu;
