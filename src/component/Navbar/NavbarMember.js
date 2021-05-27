import React, { useState } from "react";
import "./NavbarMember.css";
import logoapp from "../../img/logo.png";
import profilelogo from "../../img/user1.png";
import { BrowserRouter, Route, Link, Router, Redirect, useHistory } from "react-router-dom";
import Auth from '../../service/authService.js'
import { DropdownButton, Dropdown } from 'react-bootstrap'

export default function Navbar() {
  const history = useHistory();
  const currentUser = Auth.getCurrentUser()
  const [check, setCheck] = useState(false)

  const gotohome = () => {
    history.push("/member");
  };


  const logout = () => {
    Auth.logout();
    history.push("/");
  }
  // console.log("navbar curretnuser: ",currentUser);
  return (
    <div className="NavMember-container">
      <img
        src={logoapp}
        className="logoapp"
        width="200"
        height="100"
        onClick={gotohome}
      ></img>
      <div className="NavMember-container2">
        <Link to="/member">
          <p className="menu-p">หน้าแรก</p>
        </Link>
        <Link to="/bookdorm">
          <p className="menu-p">รายการหอพักที่บันทึก</p>
        </Link>
        <DropdownButton id="dropdown-member-page" title={
          <div className='dropdown-btn-member'>
            <img src={profilelogo} className="profilelogo" width="25" height="25"></img>
            <p>{currentUser.username}</p>
          </div>
        } >
          <Dropdown.Item className="dropdown-option-member" onClick={logout}>ออกจากระบบ</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}
