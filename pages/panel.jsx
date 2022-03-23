import React from "react";
import UserDashboard from "../components/UserDashboard/UserDashboard";
import Nav from "../components/Nav/Nav";
const panel = () => {
  return (
    <>
      <Nav />
      <div>
        <UserDashboard />
      </div>
    </>
  );
};

export default panel;
