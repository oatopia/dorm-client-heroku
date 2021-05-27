import "./register.css";
import img from "./img/registerimg.png";
import Navbar from "./component/Navbar/Navbar.js";
import React, { useState } from "react";
import Auth from "./service/authService.js";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import Swal from 'sweetalert2'

function Register() {
    const history = useHistory();

    const validate = Yup.object({
        username: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
        password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
    });

    return (
        <>
            <div className="navbar-register-container">
                <Navbar></Navbar>
            </div>
            <div className="container-register">
                <div className="container1-register">
                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
                            type:"สมาชิก"
                        }}
                        validationSchema={validate}
                        onSubmit={values=>{
                            console.log("values",values)
                            Auth.register(values.username, values.password, values.type).then((Response) => {
                                if (Response.data.message) {
                                    Swal.fire({
                                        title: Response.data.message,
                                        icon: 'error',
                                        confirmButtonText: 'ตกลง'
                                      })
                                } else {
                                    if (values.type == "สมาชิก") {
                                        history.push("/loginmember");
                                    } else {
                                        history.push("/loginowner");
                                    }
                                }
                            })
                        }}
                    >
                        {({errors}) => (
                            <Form className="form1">
                                <h1 id="head-register">สมัครสมาชิก</h1>
                                <p>ชื่อผู้ใช้*</p>
                                <Field
                                    className="input-text-register"
                                    name="username"
                                    style={errors.username && {border:'1px solid red'}}
                                />
                                <ErrorMessage component='div' name="username" className='error-text'/>
                                <p>รหัสผ่าน*</p>
                                <Field
                                    type="password"
                                    name="password"
                                    className="input-text-register"
                                    style={errors.password && {border:'1px solid red'}}
                                ></Field>
                                <ErrorMessage component='div' name="password" className='error-text'/>
                                <p>ประเภทผู้ใช้งาน</p>
                                <Field
                                    as="select"
                                    className="type"
                                    name="type"
                                >
                                    <option value="สมาชิก">สมาชิก</option>
                                    <option value="ผู้ประกอบการ">ผู้ประกอบการ</option>
                                </Field>
                                <button className="buttonregister-register" type="submit">
                                    สมัครสมาชิก
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <img src={img} className="img"></img>
                </div>
            </div>
        </>
    );
}

export default Register;

