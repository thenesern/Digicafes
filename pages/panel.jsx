import React from "react";
import UserDashboard from "../components/UserDashboard/UserDashboard";
import Navbar from "../components/NavBar/Navbar";
const panel = () => {
  return (
    <>
      <Navbar />
      <div>
        <UserDashboard />
      </div>
    </>
  );
};

export default panel;
