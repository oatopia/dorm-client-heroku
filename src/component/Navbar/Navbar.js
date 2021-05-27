import React, { useState } from "react";
import "./Navbar.css";
import logoapp from "../../img/logo.png";
import { BrowserRouter, Route, Link, Router, Redirect, useHistory } from "react-router-dom";
import Auth from '../../service/authService.js'
import {DropdownButton,Dropdown} from 'react-bootstrap'
const currentUser = Auth.getCurrentUser();

const Unauthen = () => {
  const [click, setClick] = useState(false);
  const gotohome = () => {
    window.location.href = "/";
  };
  return (
    <div className="Nav">
      <div className="logo-box">
        <img
          src={logoapp}
          className="logoapp"
          onClick={gotohome}
        ></img>
      </div>
      
      <ul className="listmenu">
        <Link to="/" className="linkhead">
          <p>หน้าแรก</p>
        </Link>
        {/* {click ? <div onClick={() => { setClick(true); }}><p>เข้าสู่ระบบ</p></div> 
        : <div onClick={() => { setClick(true); }}>
          เข้าสู่ระบบ
          </div>} */}
        <DropdownButton id="dropdown-basic-button" title="เข้าสู่ระบบ" >
          <div className="option-container">
          <Dropdown.Item className="dropdown-option" href="/loginmember">สมาชิก</Dropdown.Item>
          <Dropdown.Item className="dropdown-option" href="/loginowner">ผู้ประกอบการ</Dropdown.Item>
          </div>
        </DropdownButton>

        <button
          className="sign"
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          สมัครสมาชิก
        </button>
      </ul>
    </div>
  );
}


const Authen = () => {
  const history = useHistory();
  return (
    <div className="Nav">
      <div className="logo-box">
        <img
          src={logoapp}
          className="logoapp"
        ></img>
      </div>
      <ul className="listmenu">
        <Link to="/" className="linkhead">
          <p>รายการที่บันทึก</p>
        </Link>
        <button
          className="sign"
          onClick={() => {
            Auth.logout();
            history.push("/");
          }}
        >
          {currentUser.username}
        </button>
      </ul>
    </div>
  );
}



const Navbar = () => {

  return (<>
    {<Unauthen />}
  </>
  )
}

export default Navbar
