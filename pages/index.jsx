import React from "react";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";
import SearchBar from "../components/Booking/SearchBar/SearchBar";
import styles from "./HomePage.module.css";
import ContactForm from "../components/ContactForm/ContactForm";
import FAQ from "../components/Booking/FAQ/FAQ";

const HomePage = () => {
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <SearchBar />
      </div>
      <section className={styles.section} data-aos="fade-up" id="features">
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
      <Footer />
    </div>
  );
};

export default HomePage;
