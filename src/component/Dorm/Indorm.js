import axios from "axios";
import { React, useState } from "react";
import "./Indorm.css";
import addImgicon from "../../img/Group 86.png";
import Auth from "../../service/authService.js";
import authHeader from "../../service/auth-header.js";
import { Redirect, useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

export default function Indorm() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const facilitiesinsidedorm = [
    "เครื่องปรับอากาศ",
    "เครื่องทำน้ำอุ่น",
    "ตู้เสื้อผ้า",
    "โซฟา",
    "โต๊ะ",
    "เก้าอี้",
    "อ่างล้างจาน",
    "โทรทัศน์",
    "เตียงเดี่ยว",
    "เตียงคู่",
    "ตู้เย็น",
    "ไมโครเวฟ",
    "อินเตอร์เน็ตไร้สาย",
    "โทรศัพท์สายตรง",
    "ตู้เก็บของ",
  ];
  const facilitiescenter = [
    "ลิฟท์",
    "ที่จอดรถ",
    "อินเตอร์เน็ตภายในอาคาร",
    "กล้องวงจรปิด",
    "ระบบรักษาความปลอดภัยแบบ Keycard",
    "ระบบรักษาความปลอดภัยแบบแสกนลายนิ้วมือ",
    "สระว่ายน้ำ",
    "ร้านซักรีด",
    "เครื่องซักผ้า",
    "ตู้น้ำหยอดเหรียญ",
    "ร้านอาหาร",
    "ร้านสะดวกซื้อ",
    "ห้องอ่านหนังสือ",
    "ฟิตเนส",
    "ร้านเสริมสวย",
    "รถตู้รับส่ง",
  ];
  const [name, setName] = useState("");
  const [type, setType] = useState("หอพักแยกชาย-หญิง");
  const [address, setAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [water, setWater] = useState("");
  const [elec, setElec] = useState("");
  const [common, setCommon] = useState("");
  const [facilities, setfacilities] = useState([]);
  const [des, setDes] = useState("");
  const [nameOwn, setNameown] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineid, setLineid] = useState("");
  const [image, setImage] = useState([]);
  const [addroom, setAddroom] = useState([]);
  const [roomtype, setRoomtype] = useState("");
  const [roomprice, setRoomprice] = useState("");
  const [room, setRoom] = useState([]);
  const currentUser = Auth.getCurrentUser();
  const [count, setCount] = useState(1);

  let arrayFile = [];
  const history = useHistory();


  const saveinfordorm = () => {
    if (name && type && address && deposit && elec && water && common && des && nameOwn && phone && email && lineid) {
      console.log("owner id", currentUser.owner_ID);
      axios
        .post(
          url+"api/dorm/createDorm",
          {
            dorm_Name: name,
            type_D: type,
            address: address,
            deposit: deposit,
            electric_Bill: elec,
            water_Bill: water,
            common_Fee: common,
            detail: des,
            ad_Name: nameOwn,
            contact_Number: phone,
            e_Mail: email,
            line_ID: lineid,
            owner_ID: currentUser.owner_ID,
          },
          { headers: authHeader() }
        )
        .then((Response) => {
          const ID = Response.data.insertId;
          console.log("ID", Response.data.insertId);
          axios
            .post(
              url+"api/dorm/createFacilities",
              { dorm_ID: ID, facilities: facilities },
              { headers: authHeader() }
            )
            .then((Response) => {
              console.log(Response);
            });

          let formData = new FormData();
          console.log("data in arrayFile: ", arrayFile);
          for (let i = 0; i < arrayFile.length; i++) {
            formData.append("Image", arrayFile[i]);
          }
          formData.append("dorm_ID", ID);
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          // console.log("Data in formData",formData);
          axios
            .post(url+"api/dorm/createImage", formData, config)
            .then((Response) => {
              console.log(Response);
            });
          axios
            .post(url+"api/dorm/createRoom", { dorm_ID: ID, room: room }, { headers: authHeader() })
            .then((Response) => {
              console.log(Response);
            });
          history.push("/owner");
        });
    } else {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      })
    }

  };



  const OnchangeFac = (e) => {
    let checkvalue = false;
    let index = 0;
    facilities.map((data, key) => {
      if (data.facility == e.target.value) {
        return (checkvalue = true), (index = key);
      }
    });
    if (checkvalue == false) {
      setfacilities([
        ...facilities,
        { type_F: "ภายในห้องพัก", facility: e.target.value },
      ]);
    } else {
      setfacilities(
        facilities.filter((item) => item.facility != e.target.value)
      );
    }
  };

  const createTD = (e) => {
    setAddroom([...addroom, { order: count }]);
    setCount((prev) => prev + 1);
    console.log("count", count);
  };

  const addroomType = (order) => (e) => {
    let checkvalue = false;
    let index = 0;
    room.map((data, key) => {
      if (data.order == order) {
        return (checkvalue = true), (index = key);
      }
    });

    if (checkvalue == true) {
      const oldroom = [...room];
      oldroom[index].room_Type = e.target.value;
      setRoom(oldroom);
    } else {
      setRoom([
        ...room,
        { order: order, room_Type: e.target.value, room_Price: 0 },
      ]);
    }
    console.log("room from addtype: ", room);
  };

  const addroomPrice = (order) => (e) => {
    let checkvalue = false;
    let index = 0;
    room.map((data, key) => {
      if (data.order == order) {
        return (checkvalue = true), (index = key);
      }
    });

    if (checkvalue == true) {
      const oldroom = [...room];
      oldroom[index].room_Price = e.target.value;
      setRoom(oldroom);
    } else {
      setRoom([
        ...room,
        { order: order, room_Type: e.target.value, room_Price: 0 },
      ]);
    }
    console.log("room from add price: ", room);
  };

  const deleteroom = (order) => (e) => {
    setRoom(
      room.filter((item) => {
        return item.order != order;
      })
    );
    setAddroom(
      addroom.filter((item) => {
        return item.order != order;
      })
    );
  };
  return (
    <div className="containIn">
      <div className="Indorm">
        <h1>ข้อมูลหอพัก</h1>
        <div className="line-head"></div>
        <h2>ชื่อหอพัก</h2>
        <input
          className="chong-one"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <br />
        <h2>ประเภทหอพัก</h2>

        <select
          className="type-dorm"
          defaultValue="หอพักแยกชาย-หญิง"
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="หอพักแยกชาย-หญิง">หอพักแยกชาย-หญิง</option>
          <option value="หอพักรวม">หอพักรวม</option>
        </select>

        <br />
        <div className="room-container">
          <h2>ประเภทห้องพัก</h2>
          <table className="table-room-container">
            <thead>
              <tr className="heading-table">
                <th>ประเภท</th>
                <th>ราคาเช่ารายเดือน</th>
                <th>แก้ไขข้อมูล</th>
              </tr>
              <tr>
                <td>
                  <input
                    className="type-room-input"
                    type="text"
                    onChange={addroomType(0)}
                  ></input>
                </td>
                <td className="box-input-price">
                  <input
                    className="price-room-input"
                    type="text"
                    onChange={addroomPrice(0)}
                  ></input>
                  <p>บาทต่อเดือน</p>
                </td>
                <td></td>
              </tr>
              {addroom.map((data, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <input
                        className="type-room-input"
                        type="text"
                        onChange={addroomType(data.order)}
                      ></input>
                      {data.input}
                    </td>
                    <td className="box-input-price">
                      <input
                        className="price-room-input"
                        type="text"
                        onChange={addroomPrice(data.order)}
                      ></input>
                      <p>บาทต่อเดือน</p>
                    </td>
                    <td>
                      {data.order != addroom.length ? (
                        <></>
                      ) : (
                        <p onClick={deleteroom(data.order)}>ลบ</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </thead>
          </table>
          <button className="add-room-button" onClick={createTD}>
            เพิ่มประเภทห้อง
          </button>
        </div>
        <br />
        <h2>ที่อยู่หอพัก</h2>
        <textarea
          className="chong-address"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        ></textarea>
        <br />
        <h2>รายละเอียดค่าใช้จ่าย</h2>
        <table className="table-container-indorm">
          <thead>
            <tr>
              <td>
                <h4 className="pay" id="p1">
                  เงินมัดจำ/ประกัน
                </h4>
              </td>
              <td>
                <input
                  className="chong-pay"
                  onChange={(e) => {
                    setDeposit(e.target.value);
                  }}
                ></input>
              </td>
              <td>
                <h4 className="baht">บาท</h4>
              </td>
            </tr>
            <tr>
              <td>
                <h4 className="pay" id="p4">
                  ค่าส่วนกลาง
                </h4>
              </td>
              <td>
                <input
                  className="chong-pay"
                  onChange={(e) => {
                    setCommon(e.target.value);
                  }}
                ></input>
              </td>
              <td>
                <h4 className="baht">บาท</h4>
              </td>
            </tr>

            <tr>
              <td>
                <h4 className="pay" id="p2">
                  อัตราค่าน้ำ
                </h4>
              </td>
              <td>
                <input
                  className="chong-pay"
                  onChange={(e) => {
                    setWater(e.target.value);
                  }}
                ></input>
              </td>
              <td>
                <h4 className="baht">บาทต่อยูนิต</h4>
              </td>
            </tr>

            <tr>
              <td>
                <h4 className="pay" id="p3">
                  อัตราค่าไฟ
                </h4>
              </td>
              <td>
                <input
                  className="chong-pay"
                  onChange={(e) => {
                    setElec(e.target.value);
                  }}
                ></input>
              </td>
              <td>
                <h4 className="baht">บาทต่อยูนิต</h4>
              </td>
            </tr>
          </thead>
        </table>

        <h2>สิ่งอำนวยความสะดวก</h2>
        <div className="facilities">
          <div className="facilities-inside">
            <h4 className="space">ภายในห้องพัก</h4>
            {facilitiesinsidedorm.map((data, key) => {
              return (
                <div key={key} className="fac-box">
                  <input
                    type="checkbox"
                    id={key}
                    value={data}
                    onChange={OnchangeFac}
                  ></input>
                  <label htmlFor={key}>{data}</label>
                </div>
              );
            })}
          </div>
          <div className="facilites-center">
            <h4 className="space">ส่วนกลาง</h4>
            {facilitiescenter.map((data, key) => {
              return (
                <div key={key} className="fac-box">
                  <input
                    type="checkbox"
                    id={key}
                    value={data}
                    onChange={OnchangeFac}
                  ></input>
                  <label htmlFor={key}>{data}</label>
                </div>
              );
            })}
          </div>
        </div>
        <br />
        <h2>รายละเอียดหอพัก</h2>
        <textarea
          className="chong-detail "
          onChange={(e) => {
            setDes(e.target.value);
          }}
        ></textarea>
        <br />
        <h2>ข้อมูลติดต่อ</h2>
        <ul>
          <h4 className="space2">ชื่อผู้ดูแลหอพัก</h4>
          <input
            className="chong-three"
            onChange={(e) => {
              setNameown(e.target.value);
            }}
          ></input>
          <br />
          <h4 className="space2">เบอร์ติดต่อ</h4>
          <input
            className="chong-three"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          ></input>
          <br />
          <h4 className="space2">อีเมล</h4>
          <input
            className="chong-three"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <br />
          <h4 className="space2">LineID</h4>
          <input
            className="chong-three"
            onChange={(e) => {
              setLineid(e.target.value);
            }}
          ></input>
        </ul>
        <br />
        <h2>รูปภาพที่พัก</h2>
        <div className="line-head"></div>
        <input
          type="file"
          className="file-input-indorm"
          multiple
          onChange={(e) => {
            let len = e.target.files.length;
            console.log("length file:", len);
            for (let i = 0; i < len; i++) {
              console.log("round ", i, " ", e.target.files[i]);
              arrayFile.push(e.target.files[i]);
            }
          }}
        ></input>
        <button className="save-indorm" onClick={saveinfordorm}>
          บันทึกข้อมูลหอพัก
        </button>


      </div>
    </div>
  );
}
