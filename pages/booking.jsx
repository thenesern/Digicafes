// Packages and Dependencies
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
// Images
import bookingHeroTR from "../assets/image/bookingHeroTR.png";
import digitalMenuMockupEn from "../assets/image/DigitalMenuPanelMockup_en.png";
import bookingDashboardTR from "../assets/image/bookingDashboardTR.png";
import bookingShowcaseTR from "../assets/image/bookingShowcaseTR.png";
import TabletMockup from "../assets/image/tabletMockup.png";
import TabletMockupEn from "../assets/image/tabletMockup_en.png";
import QRMenuMockup from "../assets/image/QRMenuMockup.png";
import QRMenuMockupEn from "../assets/image/QRMenuMockup_en.png";
import HeroImageEn from "../assets/image/HeroImage_en.png";
import HeroImage from "../assets/image/HeroImage.png";
// Styles
import styles from "./DigitalMenuPage.module.css";
// Animations
import Aos from "aos";
import "aos/dist/aos.css";
// Components
import Nav from "../components/Nav/Nav";
import Features from "../components/DigitalMenu/Features/Features";
import StepperMobile from "../components/Booking/Steppers/StepperMobile/StepperMobile";
import BookingStepper from "../components/Booking/Steppers/BookingStepper/BookingStepper";
import FAQ from "../components/Booking/FAQ/FAQ";
import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/Footer/Footer";
import { useState } from "react";
import PricingTable from "../components/Booking/PricingTable";

const DijitalMenu = () => {
  const router = useRouter();
  let [country, setCountry] = useState("");
  useEffect(() => {
    fetch("https://api.ipregistry.co/24.133.65.59?key=qnqzqbjwa1bpjtjv")
      .then((response) => response.json())
      .then((response) => {
        setCountry(response?.location?.country?.name);
      });
  }, []);

  // Translation
  const { t } = useTranslation();
  // Animations
  useEffect(() => {
    Aos.init({ duration: 2000 });
    Aos.refresh();
  }, []);

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.topBox}>
          <div className={styles.top}>
            <div className={styles.topLeft}>
              <h1 className={styles.header}>{t("home:productName-booking")}</h1>
              <p className={styles.description}>{t("home:slogan-booking")}</p>
            </div>
            <div className={styles.images}>
              <div
                className={styles.image}
                style={{ width: "36rem", height: "auto", margin: "0" }}
              >
                {router.locale === "tr" ? (
                  <Image
                    data-aos="fade-up"
                    src={bookingHeroTR}
                    alt=""
                    layout="responsive"
                    objectFit="contain"
                  />
                ) : (
                  <Image
                    data-aos="fade-up"
                    src={HeroImageEn}
                    alt=""
                    layout="responsive"
                    objectFit="contain"
                  />
                )}
              </div>
            </div>
          </div>
          {/*   <div className={styles.referenceBox}>
            <h3 className={styles.referencesTitle}>{t("home:references")}</h3>
            <div className={styles.references}>
              <Image
                width={200}
                height={120}
                objectFit="contain"
                src={marcopascha}
                className={styles.reference}
                alt="Marco Pascha"
              />
            </div>
          </div> */}
        </div>
        <section className={styles.section} data-aos="fade-up" id="features">
          <article className={styles.first}>
            <div
              style={{ width: "40rem", height: "auto" }}
              className={styles.featuresImage1}
            >
              {router.locale === "tr" ? (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  src={bookingDashboardTR}
                  alt=""
                />
              ) : (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  src={digitalMenuMockupEn}
                  alt=""
                />
              )}
            </div>
            <div data-aos="fade-up" className={styles.firstDes}>
              <h2 className={styles.firstHeader}>
                {t("home:feature1Header-booking")}
              </h2>
              <ul className={styles.firstList}>
                <li>{t("home:title1-booking")}</li>
                <li>{t("home:title2-booking")}</li>
                <li>{t("home:title3-booking")}</li>
              </ul>
              <p>{t("home:description1-booking")}</p>
            </div>
          </article>
          <article className={styles.second}>
            <div className={styles.secondDes}>
              <h2 className={styles.secondHeader}>
                {t("home:feature2Header-booking")}
              </h2>
              <ul className={styles.secondList}>
                <li>{t("home:title4-booking")}</li>
                <li>{t("home:title5-booking")}</li>
              </ul>
              <p>{t("home:description2-booking")}</p>
            </div>
            <div
              style={{ width: "40rem", height: "auto" }}
              className={styles.featuresImage1}
            >
              {router.locale === "tr" ? (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  src={bookingShowcaseTR}
                  data-aos="fade-left"
                  alt=""
                />
              ) : (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  src={TabletMockupEn}
                  data-aos="fade-left"
                  alt=""
                />
              )}
            </div>
          </article>

          <article className={styles.steps} data-aos="fade-up" id="process">
            <div className={styles.stepper}>
              <BookingStepper />
            </div>
          </article>

          <article>
            <div className={styles.stepperMobile} data-aos="fade-up">
              <StepperMobile />
            </div>
          </article>
          <article>
            <PricingTable location={country} />
          </article>
          {/*  {router.locale === "tr" && (
            <article className={styles.youtube}>
              <div className={styles.videoBG} data-aos="fade-up">
                <iframe
                  src="https://www.youtube.com/embed/ELtbQkulWaU"
                  frameBorder="0"
                  width="560"
                  height="315"
                  className={styles.iframe}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="video"
                />
              </div>
            </article>
          )} */}
          <article className={styles.faq}>
            <div>
              <div data-aos="fade-up">
                <FAQ />
              </div>
            </div>
          </article>

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
