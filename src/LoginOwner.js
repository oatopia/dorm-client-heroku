import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginOwner.css';
import img from './img/loginown.jpg'
import Navbar from './component/Navbar/Navbar.js'
import Auth from './service/authService.js'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import Swal from 'sweetalert2'


const Loginowner = () => {

    var history = useHistory();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        Auth.loginowner(username, password)
            .then(Response => {
                history.push("/owner");
            })
    }

    const validate = Yup.object({
        username: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
        password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
    });
    return (
        <div className="login-owner-page-container">
            <div className="Navbar-login-owner-container">
                <Navbar />
            </div>
            <div className="owner-login-container">
                <div className="content-owner-login-container">
                    <Formik
                        initialValues={{
                            username: "",
                            password: ""
                        }}
                        validationSchema={validate}
                        onSubmit={value => {
                            console.log(value)
                            Auth.loginowner(value.username, value.password)
                                .then(Response => {
                                    if(Response.message){
                                        Swal.fire({
                                            title: Response.message,
                                            icon: 'error',
                                            confirmButtonText: 'ตกลง'
                                          })
                                    }else{
                                        history.push("/owner");
                                    }
                                })
                        }}
                    >
                        {({ errors }) => (
                            <Form className="form-owner-login">
                                <div>
                                    <h1 id="h-1" className="h1-login-owner">เข้าสู่ระบบสำหรับ</h1>
                                    <h1 id="h-2" className="h1-login-owner">ผู้ประกอบการ</h1>
                                </div>

                                <div className="username-text-owner">
                                    <p className="p-text">ชื่อผู้ใช้*</p>
                                    <Field type='text' className="text-input-owner-login"
                                        name='username'
                                        style={errors.username && { border: '1px solid red' }}
                                    ></Field>
                                    <ErrorMessage component='div' name="username" className='error-text' />
                                </div>
                                <div className="password-text-owner">
                                    <p className="p-text">รหัสผ่าน*</p>
                                    <Field type="password" className="text-input-owner-login"
                                        name='password'
                                        style={errors.password && { border: '1px solid red' }}
                                    ></Field>
                                    <ErrorMessage component='div' name="password" className='error-text' />
                                </div>
                                <button className="button-login-owner" type="submit">เข้าสู่ระบบ</button>
                                <hr />
                                <button className="button-register-owner" type="submit">สร้างบัญชีใหม่</button>
                            </Form>
                        )}
                    </Formik>
                    <div className='image-container-loginowner'>
                        <img src={img} className="img-loginowner" width="300" height="430"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginowner;