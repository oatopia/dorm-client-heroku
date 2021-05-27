import { React, useEffect, useState } from "react";
import "./Adminfactor.css";
import Axios from "axios";
import NavbarAdmin from "../component/Navbar/NavbarAdmin.js";
import deleteicon from "../img/deleteicon.png";
import editicon from "../img/edit.png";
import addicon from "../img/plus 2.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import Swal from 'sweetalert2'

function Adminfactor() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const [factor, setFactor] = useState([]);
  const [showadd, setShowadd] = useState(false);
  const [textinput, setTextinput] = useState("");
  const [addfactortitle, setAddfactortitle] = useState("");
  const [addfactor, setAddfactor] = useState("");
  const [image, setImage] = useState("");
  const [editname, setEditname] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editimg, setEditimg] = useState("");

  useEffect(() => {
    Axios.get(url+"api/Admin/factor")
      .then((Response) => {
        setFactor(Response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  // บันทึกปัจจัยในการตัดสินใจ--------------------------------------------------------------------------------
  const saveFactor = () => {
    const formData = new FormData();
    formData.append("ImageFactor", image);
    formData.append("new_factortitle", addfactortitle);
    formData.append("new_factor", addfactor);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    Axios.post(url+"api/Admin/saveFactor", formData, config)
      .then((Response) => {
        console.log(Response);
        setShowadd(false);
        setFactor([...factor, Response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  //--------------------------------------ลบปัจจัย-------------------------------------------------------------------
  const deleteFactor = (id) => {
    console.log("ID:", id);
    Axios.delete(url+`api/Admin/factorDelete/${id}`).then((Response) => {
      setFactor(
        factor.filter((val) => {
          return val.factor_ID != id;
        })
      );
    });
  };


  //--------------------------------------อัพเดทปัจจัย-------------------------------------------------------------------
  const updatebyId = (id) => {

    const formData = new FormData();
    formData.append("EditImage", editimg);
    formData.append("EditName", editname);
    formData.append("EditTitle", editTitle);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    Axios.put(url+`api/Admin/updateFactor/${id}`, formData, config)
      .then((Response) => {
        let Data = Response.data
        setFactor(
          factor.map((item) => {
            return item.factor_ID == id ? { factor_ID: id, factor_Title: Data.factor_Title, factor_Name: Data.factor_Name, image_Factor: Data.image_Factor }
              : item;
          }));
        setTextinput("");
      });
  };


  const validate = Yup.object({
    factor_title: Yup.string().required("กรุณากรอกข้อมูลให้ครบถ้วน"),
    factor_name: Yup.string().required("กรุณากรอกข้อมูลให้ครบถ้วน"),
  })
  const validateedit = Yup.object({
    factor_title_edit: Yup.string().required("กรุณากรอกข้อมูลให้ครบถ้วน"),
    factor_name_edit: Yup.string().required("กรุณากรอกข้อมูลให้ครบถ้วน"),
  })
  return (
    <div className="content-factor-Admin">
      <NavbarAdmin />
      <h1 className="h1-factor-Admin">ปัจจัยในการตัดสินใจเลือกหอพัก</h1>
      <div className="content2-factor-Admin">
        <button
          className="add-factor-Admin"
          onClick={() => {
            setShowadd(true);
          }}>
          <img className='add-btn-adminfac' src={addicon} width='30px' height='30px'></img>
          เพิ่มปัจจัย
        </button>
        {/* //--------------------------------------แสดงส่วนบันทึกปัจจัย------------------------------------------------------------------- */}
        {showadd &&
          <Formik
            initialValues={{
              factor_title: "",
              factor_name: ""
            }}
            validationSchema={validate}
            onSubmit={value => {
              console.log(value)
              const formData = new FormData();
              formData.append("ImageFactor", image);
              formData.append("new_factortitle", value.factor_title);
              formData.append("new_factor", value.factor_name);
              const config = {
                headers: {
                  "content-type": "multipart/form-data",
                },
              };
              Axios.post(url+"api/Admin/saveFactor", formData, config)
                .then((Response) => {
                  console.log(Response);
                  setShowadd(false);
                  setFactor([...factor, Response.data]);
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            {({ errors }) => (
              <Form className="add-box">
                <div className="text-add-factor">
                  <div className="text-factor-box">
                    <h4>ชื่อปัจจัย</h4>
                    <Field
                      className='text-factor-name'
                      type="text"
                      name='factor_title'
                      style={errors.factor_title && { border: '1px solid red' }}
                    />
                    <ErrorMessage component='div' name="factor_title" className='error-text' />
                  </div>

                  <div className="text-factor-box">
                    <h4>รายละเอียด</h4>
                    <Field
                      className='text-factor-name'
                      type="text"
                      name='factor_name'
                      style={errors.factor_name && { border: '1px solid red' }}
                    />
                    <ErrorMessage component='div' name="factor_name" className='error-text' />
                  </div>

                  <input
                    type="file"
                    className='file-factor-image'
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  ></input>
                </div>

                <button
                  className='btn-save-factor'
                  type='submit'
                >
                  บันทึกปัจจัย
            </button>
              </Form>

            )}
          </Formik>
        }

        {/* //--------------------------------------แสดงปัจจัย------------------------------------------------------------------- */}
        {factor.map((data) => {
          return (
            <div className="factor-box-Admin">
              <div >

                <Formik
                  initialValues={{
                    factor_title_edit: "",
                    factor_name_edit: ""
                  }}
                  validationSchema={validateedit}
                  onSubmit={value => {
                    let id = data.factor_ID
                    console.log(value)
                    const formData = new FormData();
                    formData.append("EditImage", editimg);
                    formData.append("EditName", value.factor_name_edit);
                    formData.append("EditTitle", value.factor_title_edit);
                    const config = {
                      headers: {
                        "content-type": "multipart/form-data",
                      },
                    };
                    Axios.put(url+`api/Admin/updateFactor/${id}`, formData, config)
                      .then((Response) => {
                        let Data = Response.data
                        setFactor(
                          factor.map((item) => {
                            return item.factor_ID == id ? { factor_ID: id, factor_Title: Data.factor_Title, factor_Name: Data.factor_Name, image_Factor: Data.image_Factor }
                              : item;
                          }));
                        setTextinput("");
                      });
                  }}
                >
                  {({ errors }) => (
                    <Form className="factor-inner-box-Admin">
                      <h1 className="factor-info">{data.factor_ID}</h1>
                      {textinput == data.factor_ID ? (
                        <div className="input-text-edit-contain">
                          <Field
                            type="text"
                            className="factor-info"
                            id="edit-input-title"
                            name="factor_title_edit"
                            style={errors.factor_title_edit && { border: '1px solid red' }}
                          />
                          <Field
                            type="text"
                            className="factor-info"
                            id="edit-input-name"
                            name="factor_name_edit"
                            style={errors.factor_name_edit && { border: '1px solid red' }}
                          />
                          <ErrorMessage component='div' name="factor_name_edit" className='error-text' />
                        </div>
                      ) : (
                        <div className='factor-name-title'>
                          <h2 className="factor-title" id="fname">
                            {data.factor_Title}
                          </h2>
                          <h4 className="factor-name" id="fname">
                            {data.factor_Name}
                          </h4>
                        </div>
                      )}

                      {textinput == data.factor_ID ? (
                        <div className="edit-mini-box">
                          <input type="file"
                            className="edit-image"
                            onChange={(e) => { setEditimg(e.target.files[0]) }}
                          ></input>

                          <button
                            className="save-edit-button"
                            type="submit"
                          >
                            บันทึกการแก้ไข
                      </button>

                        </div>
                      ) : (
                        <img
                          src={url+"images/" + data.image_Factor}
                          width="60px"
                          height="60px"
                        ></img>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="factor-icon-box-Admin">
                <img
                  src={editicon}
                  className="icon-factor-Admin"
                  width="40px"
                  height="40px"
                  onClick={() => {
                    setTextinput(data.factor_ID);
                  }}
                ></img>
                <img
                  src={deleteicon}
                  className="icon-factor-Admin"
                  width="40px"
                  height="40px"
                  onClick={() => {
                    deleteFactor(data.factor_ID);
                  }}
                ></img>
              </div>
            </div>
          );
        })}
      </div>
      <div className="clear-factor-Admin"></div>
    </div>
  );
}

export default Adminfactor;
