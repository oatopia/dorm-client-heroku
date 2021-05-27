import React from "react";
import "./NavbarAdmin.css"
import logoapp from "../../img/logoapp.png"
import profilelogo from "../../img/profile-user.png"
import usericon from '../../img/user.png'
import factoricon from '../../img/factoricon.png'
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="NavAdmin-container">
      <img src={logoapp} className="homelogo-Admin" width="200" height="100"></img>
      <div className="NavAdmin-container2">
        <Link to="/Admin" className="Admin-func">บัญชีผู้ใช้งาน</Link>
        <Link to="/Adminfactor" className="Admin-func">ปัจจัยในการตัดสินใจเลือกหอพัก</Link>
      </div>
    </div>
  );
}
