import { React, useEffect, useState, useRef } from 'react';
import { Redirect, useHistory } from 'react-router-dom'
import './member.css';
import NavbarMember from '../component/Navbar/NavbarMember.js';
import Match_member from '../component/Match/Match-member';
import Axios from 'axios'
import Auth from '../service/authService.js'
import authHeader from '../service/auth-header.js';

function Member() {
  const history = useHistory()
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const [search, setSearch] = useState("");
  const currentUser = Auth.getCurrentUser();
  const [error, setError] = useState()
  const myref = useRef(null)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const searchFac = () => {
    if (search) {
      Axios.post(url+'api/match/searchDorm', {
        Search: search
      }, { headers: authHeader() })
        .then(Response => {
          console.log("Respone serach: ", Response.data);
          let data = Response.data
          history.push({
            pathname: "/dormdetail",
            state: data,
          })
        }).catch(error => {
          console.log(error);
        })
    } else {
      setError("กรุณากรอกชื่อหอพัก")
    }
  }

  if (!currentUser) {
    return <Redirect to="/login" />
  }
  return (
    <div className="appcontainer-member">
      <div className='background-member'>
        <div className='navbar-member-container'>
          <NavbarMember></NavbarMember>
        </div>
        <h1 className='head-member-page'>ยินดีต้อนรับคุณ {currentUser.username}</h1>
        <p className='text-match-scroll-page' onClick={() => { myref.current.scrollIntoView() }}>เริ่มต้นใช้งาน</p>
      </div>
      <div className="searchbar-member">
        <input className="searchinput-member" placeholder={error ? error : "ค้นหาหอพัก..."} style={error && { border: '2px solid red' }} onChange={(e) => {
          setSearch(e.target.value);
        }}></input>
        <button className="searchbutton-member" onClick={searchFac}>ค้นหา</button>
      </div >
      <div ref={myref}>
        <Match_member />
      </div>
    </div>
  );
}

export default Member;