import React from "react";
import DigitalMenuPage from "../components/DigitalMenuPage/DigitalMenuPage";
import Footer from "../components/Footer/Footer";
import Nav from "../components/Nav/Nav";

const DijitalMenu = () => {
  return (
    <div>
      <Nav />
      <div>
        <DigitalMenuPage />
      </div>
      <Footer />
    </div>
  );
};

export default DijitalMenu;
