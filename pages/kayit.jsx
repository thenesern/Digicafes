import React from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Navbar from "../components/NavBar/Navbar";

const register = () => {
  return (
    <>
      <Navbar />
      <div>
        <RegisterForm />
      </div>
    </>
  );
};

export default register;
