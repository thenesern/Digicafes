import React, { useEffect } from "react";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
import SearchBar from "../components/Booking/SearchBar/SearchBar";
import styles from "./HomePage.module.css";
import ContactForm from "../components/ContactForm/ContactForm";
import FAQ from "../components/Booking/FAQ/FAQ";
// Animations
import Aos from "aos";
import "aos/dist/aos.css";
import Partnership from "../components/Partnership";

const HomePage = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
    Aos.refresh();
  }, []);

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <SearchBar />
      </div>
      <section className={styles.section} data-aos="fade-up" id="features">
        <article className={styles.partner}>
          <div>
            <Partnership />
          </div>
        </article>
        <article className={styles.faq}>
          <div data-aos="fade-up">
            <FAQ />
          </div>
        </article>
        <div data-aos="fade-up" style={{ width: "100%" }}>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
