import React from "react";
import Footer from "../../components/Footer/Footer";
import MembershipAgreement from "../../components/MembershipAgreement/MembershipAgreement";
import Nav from "../../components/Nav/Nav";

const index = () => {
  return (
    <div>
      <Nav />
      <MembershipAgreement />
      <Footer />
    </div>
  );
};

export default index;
