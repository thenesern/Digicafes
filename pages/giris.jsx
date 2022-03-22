import React from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import Navbar from "../components/NavBar/Navbar";
const register = () => {
  return (
    <>
      <Navbar />
      <div>
        <LoginForm />
      </div>
    </>
  );
};

export default register;
