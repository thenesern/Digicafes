import React from "react";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
// Packages and Dependencies
import LinkRouter from "next/link";
import Head from "next/head";
import { Link } from "react-scroll";
import Image from "next/image";
import digitalMenuMockup from "../assets/image/DigitalMenuPanelMockup.png";
import digitalMenuMockupEn from "../assets/image/DigitalMenuPanelMockup_en.png";
import TabletMockup from "../assets/image/tabletMockup.png";
import TabletMockupEn from "../assets/image/tabletMockup_en.png";
import QRMenuMockup from "../assets/image/QRMenuMockup.png";
import QRMenuMockupEn from "../assets/image/QRMenuMockup_en.png";
import DigitalMenuStepper from "../components/DigitalMenuPage/DigitalMenuStepper/DigitalMenuStepper";
import StepperMobile from "../components/DigitalMenuPage/StepperMobile/StepperMobile";
import FAQ from "../components/FAQ/FAQ";
import ContactForm from "../components/ContactForm/ContactForm";
import favicon from "../public/favicon.ico";
import whatsapp from "../assets/image/whatsapp.png";
import marcopascha from "../assets/refers/marcologo.png";
import route from "../assets/refers/route.png";
import { useRouter } from "next/router";
// Styles
import styles from "./DigitalMenuPage.module.css";
import Aos from "aos";
import { useEffect } from "react";
import { useState } from "react";
import "aos/dist/aos.css";
import Features from "../components/Features/Features";
import useTranslation from "next-translate/useTranslation";

const DijitalMenu = () => {
  const router = useRouter();
  const { t } = useTranslation();
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
        {router?.locale === "tr" && (
          <div className={styles.wpBtn}>
            <a
              href="https://api.whatsapp.com/send?phone=905012345324"
              target="_blank"
              rel="noreferrer"
            >
              <Image layout="responsive" objectFit="contain" src={whatsapp} />
            </a>
          </div>
        )}
        <div className={styles.topBox}>
          <div className={styles.top}>
            <div className={styles.topLeft}>
              <h1 className={styles.header}>{t("home:productName")}</h1>
              <p className={styles.description}>{t("home:slogan")}</p>
            </div>
            <div className={styles.images}>
              <div
                className={styles.image}
                style={{ width: "36rem", height: "auto" }}
              >
                {router.locale === "tr" ? (
                  <Image
                    src={digitalMenuMockup}
                    layout="responsive"
                    objectFit="contain"
                    className={styles.referenceImg}
                    alt=""
                  />
                ) : (
                  <Image
                    src={digitalMenuMockupEn}
                    layout="responsive"
                    objectFit="contain"
                    className={styles.referenceImg}
                    alt=""
                  />
                )}
              </div>
              <div
                className={styles.image2}
                style={{ width: "12rem", height: "auto" }}
              >
                {router.locale === "tr" ? (
                  <Image
                    layout="responsive"
                    objectFit="contain"
                    data-aos="fade-left"
                    className={styles.referenceImg}
                    src={TabletMockup}
                    alt=""
                  />
                ) : (
                  <Image
                    layout="responsive"
                    objectFit="contain"
                    data-aos="fade-left"
                    className={styles.referenceImg}
                    src={TabletMockupEn}
                    alt=""
                  />
                )}
              </div>
              <div
                className={styles.image3}
                style={{ width: "7rem", height: "auto" }}
              >
                {router.locale === "tr" ? (
                  <Image
                    data-aos="fade-right"
                    src={QRMenuMockup}
                    alt=""
                    layout="responsive"
                    objectFit="contain"
                  />
                ) : (
                  <Image
                    data-aos="fade-right"
                    src={QRMenuMockupEn}
                    alt=""
                    layout="responsive"
                    objectFit="contain"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.referenceBox}>
            <h3 className={styles.referencesTitle}>{t("home:references")}</h3>
            <div className={styles.references}>
              <Image
                width={200}
                height={120}
                objectFit="contain"
                src={marcopascha}
                className={styles.reference}
              />
              <Image
                width={200}
                height={120}
                className={styles.reference}
                objectFit="contain"
                src={route}
              />
            </div>
          </div>
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
                  src={digitalMenuMockup}
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
              <h2 className={styles.firstHeader}>{t("home:feature1Header")}</h2>
              <ul className={styles.firstList}>
                <li>{t("home:f1")}</li>
                <li>{t("home:f2")}</li>
                <li>{t("home:f3")}</li>
              </ul>
              <p>{t("home:d1")}</p>
            </div>
          </article>

          <article className={styles.second}>
            <div className={styles.secondDes}>
              <h2 className={styles.secondHeader}>
                {t("home:feature2Header")}
              </h2>
              <ul className={styles.secondList}>
                <li>{t("home:f4")}</li>
                <li>{t("home:f5")}</li>
              </ul>
              <p>{t("home:d2")}</p>
            </div>
            <div
              style={{ width: "18rem", height: "auto" }}
              className={styles.featuresImage2}
            >
              {router.locale === "tr" ? (
                <Image
                  layout="responsive"
                  objectFit="contain"
                  src={TabletMockup}
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
          <article className={styles.third}>
            <div
              className={styles.featuresImage3}
              style={{ width: "12rem", height: "auto" }}
            >
              {router.locale === "tr" ? (
                <Image
                  src={QRMenuMockup}
                  alt=""
                  layout="responsive"
                  data-aos="fade-right"
                  objectFit="contain"
                />
              ) : (
                <Image
                  src={QRMenuMockupEn}
                  alt=""
                  layout="responsive"
                  data-aos="fade-right"
                  objectFit="contain"
                />
              )}
            </div>
            <div className={styles.thirdDes}>
              <h2 className={styles.thirdHeader}>{t("home:feature3Header")}</h2>
              <ul className={styles.thirdList}>
                <li>{t("home:f6")}</li>
                <li>{t("home:f7")}</li>
              </ul>
              <p>{t("home:d3")}</p>
            </div>
          </article>
          <article className={styles.steps} data-aos="fade-up" id="process">
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
            <Features />
          </article>
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
