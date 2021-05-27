import { React, useEffect, useState } from 'react';
import './dormVisitor.css';
import Navbar from '../component/Navbar/Navbar.js';
import Axios from 'axios'
import { useHistory, useLocation } from 'react-router';
import imagetest from '../img/livingroom1.jpg'



function DormVisitor() {
  const history = useHistory();
  const url = "https://matching-dorm-tu-server.herokuapp.com/";
  let location = useLocation();
  let state = location.state;
  console.log("sate match:", state);
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="dormVisitor-container">
      <div className='Navbar-shadow-box'>
        <Navbar></Navbar>
      </div>
      <div className="dormVisitor-block">
        <div className="dorm-data-container">
          <label className="name-dormVisitor">หอพัก{state.Dorm.dorm_Name}</label>
          <div className="image-dormVisitor-container">
            {state.Image.map(img => {
              return <img className='img-box-dormVisitor' src={url+"img_Dorm/" + img.image}></img>
            })}
          </div>


          <div className='content-dormVisitor'>

            <div className="address-dormVisitor">
              <h3>ที่อยู่</h3>
              <p>{state.Dorm.address}</p>
            </div>

            <div className="type-typeroom-cost-container">
              <div className="type-dormVisitor">
                <h3>ประเภทหอพัก</h3>
                <p>{state.Dorm.type_D}</p>
              </div>

              <div className='table-continaer-dormVisitor'>
                <h3 className='room-type-dormVisitor'>ประเภทห้องพัก</h3>
                <table className='table-dormVisitor'>
                  <thead>
                    <tr>
                      <th>
                        ประเภท
                    </th>
                      <th>
                        ราคา
                    </th>
                    </tr>
                    {state.Room.map(room => {
                      return (
                        <tr>
                          <td>
                            {room.room_Type}
                          </td>
                          <td>
                            {room.room_Price}
                          </td>
                        </tr>
                      )
                    })}
                  </thead>
                </table>
              </div>
              <div className='table-cost-container-dormVisitor'>
                <h3 className='cost-dormVisitor'>รายละเอียดค่าใช้จ่าย</h3>
                <table className='table-cost-dormVisitor'>
                  <thead>
                        <tr>
                          <td>
                            <span>เงินมัดจำ/ประกัน</span>
                          </td>
                          <td>
                            {state.Dorm.deposit} บาท
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <span>ค่าส่วนกลาง</span>
                          </td>
                          <td>
                            {state.Dorm.common_Fee} บาท
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <span> อัตราค่าน้ำ</span>
                          </td>
                          <td>
                            {state.Dorm.water_Bill} บาทต่อยูนิต
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <span>อัตราค่าไฟ</span>
                          </td>
                          <td>
                            {state.Dorm.electric_Bill} บาทต่อยูนิต
                          </td>
                        </tr>
                  </thead>
                </table>
              </div>

            </div>




            <div className="facilities-dormVisitor">
              <h3>สิ่งอำนวยความสะดวก</h3>
              <div className="faciliites-content-dormVisitor">
                <div className="fac-inner-dormVisitor">
                  <h4>ภายในห้องพัก</h4>
                  {state.Facility.map(data => {
                    if (data.type_F == 'ภายในห้องพัก') {
                      return (<li>{data.facility}</li>)
                    }
                  })}
                </div>

                <div className="fac-center-dormVisitor">
                  <h4>ส่วนกลาง</h4>
                  {state.Facility.map(data => {
                    if (data.type_F == 'ส่วนกลาง') {
                      return (<li>{data.facility}</li>)
                    }
                  })}
                </div>
              </div>
            </div>


            <div className="detail-contact-container-dormVisitor">
              <div className="detail-container-dormVisitor">
                <h3>รายละเอียดหอพัก</h3>
                <p>{state.Dorm.detail}</p>
              </div>

              <div className="contact-container-dormVisitor">
                <h3>ข้อมูลติดต่อ</h3>
                <table className='table-contact-dormVisitor'>
                  <thead>
                    <tr>
                      <td>
                      <span> ชื่อผู้ดูแลหอพัก</span>
                      </td>
                      <td>
                      {state.Dorm.ad_Name}
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <span> เบอร์ติดต่อ </span>
                      </td>
                      <td>
                      {state.Dorm.contact_Number}
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <span> อีเมล </span>
                      </td>
                      <td>
                      {state.Dorm.e_Mail}
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <span> Line ID </span>
                      </td>
                      <td>
                      {state.Dorm.line_ID}
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
                  
            </div>
            <button className='btn-back-dormVisitor' onClick={()=>{ history.goBack()}}>ย้อนกลับ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DormVisitor;