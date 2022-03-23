import React from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Nav from "../components/Nav/Nav";

const register = () => {
  return (
    <>
      <Nav />
      <div>
        <RegisterForm />
      </div>
    </>
  );
};

export default register;
