import React, { useState } from "react";
import "./NavbarOwner.css";
import logoapp from "../../img/logo.png";
import profilelogo from "../../img/user1.png";
import { BrowserRouter, Route, Link, Router, Redirect, useHistory } from "react-router-dom";
import Auth from '../../service/authService.js'
import { DropdownButton, Dropdown } from 'react-bootstrap'


export default function Navbar() {
  const currentUser = Auth.getCurrentUser();
  const history = useHistory();
  const [ischeck, setIscheck] = useState(false);
  const [size, setSize] = useState('')
  const logout = () => {
    Auth.logout();
    history.push("/");
  }

  const adddiv = (e) => {
    setSize('100px')
  }
  return (
    <div className="NavOwner-container">
      <img src={logoapp} className="logoapp" width="200" height="100"></img>
      <div className="NavOwner-container2">
        <Link to="/owner">
          <p className="menu-p-owner">หน้าแรก</p>
        </Link>
        <DropdownButton menuAlign="right" id="dropdown-owner-page" title={
          <div className="profile-content-owner">
            <img src={profilelogo} className="profilelogo" width="25px" height="25px" ></img>
            <p>{currentUser.username}</p>
          </div>
        }>
          <Dropdown.Item className="dropdown-option-owner" onClick={logout}>ออกจากระบบ</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}
