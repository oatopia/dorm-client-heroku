import React, { useRef, useState,useEffect } from "react";
import "./Visitor.css";
import Navbar from "../component/Navbar/Navbar.js";
import Showfactor from '../component/showfactor.js'
import { useHistory } from "react-router";
import Axios from "axios";



function Visitor() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/";
  const [search,setSearch] = useState()
  const [error,setError] = useState()
  const history = useHistory();
  const myref  = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const onClickforSerach = () => {
    if(search){
      Axios.post(url+'api/visitor/searchDorm',{
        dormname:search
      },)
      .then(Response => {
          console.log("Respone search: ",Response.data);
            history.push({
              pathname: "/searchvisitor",
              state: Response.data,
            });
          
      }).catch(error=>{
          console.log(error);
      })
    }else{
      setError("กรุณากรอกชื่อหอพัก")
    }
    
  }
  return (
    <div className="parrent-contain">
      <div className="appcontainer">
        <div className="sticky">
          <Navbar></Navbar>
          <div className="header-contain">
            <h1>Dorm Matching TU</h1>
            <h2>เว็บจับคู่หอพักที่จะช่วยคุณตัดสินใจเลือกหอพักได้ง่ายขึ้น </h2>
            <h3>คุณสามารถค้นหาและจับคู่หอพักที่ตรงตามคุณลักษณะของคุณได้</h3>
            <h3>หากคุณเป็นสมาชิกคุณสามารถบันทึกหอพักที่คุณสนใจ</h3>
            <h3>และบันทึกหรือแก้ไขคำตอบของแบบสอบถามได้</h3>
            <p className='text-match-scroll' onClick={()=>{myref.current.scrollIntoView()}}>เริ่มต้นใช้งาน</p>
          </div>
        </div>
      </div>
      <div className="searchbar-Visitor">
          <input className="searchinput-Visitor" placeholder={error ? error :"ค้นหาหอพัก..."}  style={error && { border: '2px solid red' }} onChange={e=>{setSearch(e.target.value)}}></input>
          <button className="searchbutton-Visitor" onClick={onClickforSerach}>ค้นหา</button>
      </div>
      <div className="match-container" ref={myref}>
        <Showfactor />
      </div>
    </div>
  );
}

export default Visitor;
