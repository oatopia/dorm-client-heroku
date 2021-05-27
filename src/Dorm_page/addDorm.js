import React, { useEffect, useState } from "react";
import "./addDorm.css";
import Navbar from "../component/Navbar/NavbarOwner.js";
import Axios from "axios";
import Auth from "../service/authService.js";
import { Redirect,useHistory } from "react-router-dom";
import authHeader from "../service/auth-header.js";
import Indorm from "../component/Dorm/Indorm.js";

const Adddorm = () => {
  const currentUser = Auth.getCurrentUser();
  if (!currentUser) {
    return <Redirect to="/loginowner" />;
  }

  return (
    <div className="owner-container">
      <Navbar />
      <Indorm/>
    </div>
  );
};

export default Adddorm;
