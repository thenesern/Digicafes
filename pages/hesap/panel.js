import React from "react";
import Nav from "../../components/Nav/Nav";
import UserDashboard from "../../components/UserDashboard/UserDashboard";

const panel = () => {
  return (
    <div>
      <Nav />
      <UserDashboard />
    </div>
  );
};

export default panel;
