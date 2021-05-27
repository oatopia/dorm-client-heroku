import { React, useEffect, useState } from "react";
import "./bookDorm.css";
import NavbarMember from "../component/Navbar/NavbarMember.js";
import Axios from "axios";
import bookon from "../img/bookon.png";
import bookoff from "../img/bookoff.png";
import Auth from "../service/authService.js";
import authHeader from "../service/auth-header.js";
import { useHistory } from "react-router";

function ResultMatch() {
  const history = useHistory()
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const currentUser = Auth.getCurrentUser();
  const [book, setBook] = useState([]);
  const [checkdata, setCheckdata] = useState()
  useEffect(() => {
    window.scrollTo(0, 0)
    Axios.post(
      url+"/api/match/getBookmark",
      { member_ID: currentUser.member_ID },
      { headers: authHeader() }
    )
      .then((Response) => {
        console.log("Book mark dorm: ", Response.data);
        let res = Response.data;
        if (res.length > 0) {
          setCheckdata(true)
          setBook(res);
        }else{
          setCheckdata(false)
        }
      })
      .catch((error) => {
        console.log("Error from get Bookmark", error);
      });
  }, []);




  const handleonclick = (saveid) => (e) => {
    e.stopPropagation()
    let id = saveid
    Axios.delete(url+`/api/match/deletebook/${id}`, {
      headers: authHeader(),
    })
      .then((Response) => {
        console.log("data from delete Book mark dorm: ", Response.data)
        setBook(
          book.filter((item) => {
            return item.Dorm.save_ID != id
          })
        )
        if(!book){
          setCheckdata(false)
        }
      })
      .catch((error) => {
        console.log("Error from delete bookmark", error)
      })
  };


  return (
    <div className="book-conatiner-bookDorm">
      <div className='Navbar-shadow-box'>
        <NavbarMember />
      </div>

      {checkdata == false && <h1 className="text-no-dorm-save">ไม่มีรายการหอพักที่บันทึก</h1>}
      {checkdata == true &&    
      <div>
        <h1 className='h1-bookdorm'>รายการหอพักที่บันทึก</h1>
        {book.map((data, key) => {
          return (
            <div className="dorm-container" key={key} onClick={() => {
              history.push({
                pathname: "/dormdetail",
                state: data,
              })
            }}>
              <div className="start-result-box">
                <img className='img-dorm-box' src={url+"img_Dorm/" + data.Image[0].image}></img>
                <h1>หอพัก{data.Dorm.dorm_Name}</h1>
              </div>
              <div className="end-result-box">
                <img className="book-icon" src={bookon} onClick={handleonclick(data.Dorm.save_ID)} />
                <div className="line-end-box"></div>
                <div className="price-box">
                  <p className="price-text-head"> ราคาเริ่มต้น</p>
                  <p className="price-text-value">{data.Room[0].room_Price} บาท</p>
                </div>
              </div>

            </div>
          )
        })}
      </div>
      }
    </div>
  );
}

export default ResultMatch;
