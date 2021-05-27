import { React, useEffect, useState } from "react";
import "./resultmatch.css";
import NavbarMember from "../component/Navbar/NavbarMember.js";
import Axios from "axios";
import { useHistory, useLocation } from "react-router";
import bookon from "../img/bookon.png";
import bookoff from "../img/bookoff.png";
import Auth from "../service/authService.js";
import authHeader from "../service/auth-header.js";

function ResultMatch() {
  const history = useHistory()
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  var location = useLocation();
  const state = location.state;
  const currentUser = Auth.getCurrentUser();
  const [bookstate, setBookState] = useState([]);
  const [dorm,setDorm] = useState([])
  const [bookmark,setBookmark] = useState([])
  useEffect(() => {
    window.scrollTo(0, 0)
    let payload = {
      member_ID: currentUser.member_ID , 
      Dorm:state
    }
    Axios.post(
      url+"api/match/getdorm",payload,
      { headers: authHeader() }
    ).then((Response) => {
        if(Response.data.Dormlist.length > 0){
          console.log('Response from get Dorm',Response.data)
          setDorm(Response.data.Dormlist)
          setBookmark(Response.data.Bookmark)
        }
      })
      .catch((error) => {
        console.log("Error from get dorm", error);
      });
  }, []);

  const handleonclick = (dormid)=>(e) => {
    e.stopPropagation()
    let stateinside = false;
    let saveid = 0;
    bookmark.map((item) => {
      if (item.dorm_ID == dormid) {
        stateinside = true;
        saveid = item.save_ID;
      }
    });
    if (stateinside == true) {
      e.target.setAttribute("src", bookoff)
      let id = saveid;
      Axios.delete(url+`/api/match/deletebook/${id}`, {
        headers: authHeader(),
      })
        .then((Response) => {
          console.log("data from delete Book mark dorm: ", Response.data)
          setBookmark(
            bookmark.filter((item) => {
              return item.save_ID != id
            })
          )
        })
        .catch((error) => {
          console.log("Error from save bookmark", error)
        })

    } else {
      e.target.setAttribute("src", bookon);
      const payload = {
        member_ID: currentUser.member_ID,
        dorm_ID: dormid,
      };
      Axios.post(url+"api/match/createbook", payload, {
        headers: authHeader(),
      })
        .then((Response) => {
          console.log("Book mark dorm: ", Response.data);
          setBookmark([
            ...bookmark,
            {
              member_ID: currentUser.member_ID,
              dorm_ID: dormid,
              save_ID: Response.data.insertId
            }
          ]);
        })
        .catch((error) => {
          console.log("Error from save bookmark", error);
        });
    }
  };

  const checkBook = (dormid) =>{
    let check = false
    console.log("Bookmark data",bookmark)
    for (let i = 0; i < bookmark.length; i++) {
      if(dormid == bookmark[i].dorm_ID){
        check = true
        break
      }
    }
    return check
  }

  return (
    <div className="book-conatiner-bookDorm">
      <div className='Navbar-shadow-box'>
        <NavbarMember />
      </div>

      <div className="dorm-list-contain">
        {dorm.map((data, key) => {
          return (
            <div className="dorm-container" key={key} onClick={() => {
              history.push({
                pathname: "/dormdetail",
                state: data,
              })
            }}>
              <div className="start-result-box">
                <img className='img-dorm-box' src={url+"img_Dorm/" + data.Image[0].image}  ></img>
                <h1>หอพัก{data.Dorm.dorm_Name}</h1>
              </div>
              <div className="end-result-box">
                <img className="book-icon" src={checkBook(data.Dorm.dorm_ID) == true ? bookon : bookoff} onClick={handleonclick(data.Dorm.dorm_ID)}/>
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
    </div>
  )
}

export default ResultMatch;
