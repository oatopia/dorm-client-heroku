import { React, useEffect, useState } from "react";
import "./Admin.css";
import Axios from "axios";
import NavbarAdmin from "../component/Navbar/NavbarAdmin.js";
import deleteicon from "../img/deleteicon.png";
import editicon from "../img/edit.png";
import user from "../img/user 2.png";

function Admin() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const [member, setMember] = useState([]);
  const [owner, setOwner] = useState([]);
  const [editAC, setEditAC] = useState("");
  const [editun, setEditUN] = useState("");
  const [editT, setEditT] = useState("");
  const [state, setState] = useState(true)


  const deletetMember = (id) => {
    Axios.delete(url+`api/Admin/memberDelete/${id}`).then((Response) => {
      setMember(
        member.filter((val) => {
          return val.member_ID != id;
        })
      );
    });
  };

  const deleteOwner = (id) => {
    Axios.delete(url+`api/Admin/ownerDelete/${id}`).then((Response) => {
      setMember(
        member.filter((val) => {
          return val.member_ID != id;
        })
      );
    });
  };

  useEffect(() => {
    Axios.get(url+"api/Admin/user")
      .then((Response) => {
        let data = Response.data
        setMember(data[0])
        setOwner(data[1])
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const Showmember = () => {
    return (
      <>
        {member.map(data => {
          return (
            <div className='account-box'>
              <div className='icon-username'>
                <img src={user} width='40px' height='40px' />
                <h1>{data.username}</h1>
              </div>
              <div >
                <img
                  src={deleteicon}
                  onClick={() => {
                    deletetMember(data.member_ID);
                  }}
                  className="icon-user"
                ></img>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  const Showowner = () => {
    return (
      <>
        {owner.map(data => {
          return (
            <div className='account-box'>
              <div className='icon-username'>
                <img src={user} width='40px' height='40px' />
                <h1>{data.username}</h1>
              </div>
              <div>
                <img
                  src={deleteicon}
                  onClick={() => {
                    deleteOwner(data.owner_ID);
                  }}
                  className="icon-user"
                ></img>
              </div>
            </div>
          )
        })}
      </>
    )
  }




  return (
    <div className="contnet-user-Admin">
      <NavbarAdmin></NavbarAdmin>
      <h1 className="h1-user-Admin">บัญชีผู้ใช้งานทั้งหมด</h1>

      <div className="content2-user-admin">

        <div className='head-text-admin'>
          <h3 className='h3-text-admin' onClick={() => { setState(true) }} style={state == true ? { border: '2px solid #28527a' } : { color: '#0475AD' }}>
            สมาชิก
          </h3>
          <h3 className='h3-text-admin' onClick={() => { setState(false) }} style={state == false ? { border: '2px solid #28527a' } : { color: '#0475AD' }}>
            ผู้ประกอบการ
          </h3>
        </div>
        <div className='content-account-admin'>
          {state == true ? <Showmember /> : <Showowner />}
        </div>
      </div>
      <div className="clear-user-Admin"></div>
    </div>
  );
}

export default Admin;
