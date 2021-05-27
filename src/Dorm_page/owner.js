import React, { useEffect, useState } from "react";
import "./owner.css";
import Navbar from "../component/Navbar/NavbarOwner.js";
import Axios from "axios";
import backgroundimg from "../img/operatorbackground.jpg";
import Auth from "../service/authService.js";
import { Redirect, useHistory } from "react-router-dom";
import authHeader from "../service/auth-header.js";
import plus from '../img/plus 2.png'

const Owner = () => {
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const [dorm, setDorm] = useState([]);
  const currentUser = Auth.getCurrentUser();
  const history = useHistory();
  useEffect(() => {
    console.log("owner ID", currentUser.owner_ID)
    Axios.post(
      url+"api/dorm/getDorm",
      { owner_ID: currentUser.owner_ID },
      { headers: authHeader() }
    )
      .then((Response) => {
        console.log("Response dorm: ", Response.data);
        setDorm(Response.data);
        console.log("dorm: ", dorm);
      })
      .catch((error) => {
        console.log("Error from get Factor", error);
      });
  }, []);

  if (!currentUser) {
    return <Redirect to="/loginowner" />;
  }
  return (
    <div className="owner-container">
      <div className="navbar-owner-container">
        <Navbar />
      </div>
      <div className="content-owner-container">
        <div className="background-header">
          <button
            className="add-dorm"
            onClick={() => {
              history.push("/addDorm");
            }}
          >
            <img src={plus} width="30px" height="30px"></img>
            <h2 className="add-text">เพิ่มข้อมูลหอพัก</h2>
          </button>
        </div>
        <div className="contain-dorm">
          {dorm.map((item, key) => {
            return (
              <div
                className="box-dorm"
                key={key}
                onClick={() => {
                  history.push({
                    pathname: "/dormdata",
                    state: item.dorm_ID,
                  });
                }}
              >
                <h3 className="h3-dorm">{item.dorm_Name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Owner;
