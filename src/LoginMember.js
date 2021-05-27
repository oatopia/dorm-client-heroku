import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import './LoginMember.css';
import img from './img/loginimg.jpg'
import Navbar from './component/Navbar/Navbar.js'
import Axios from 'axios'
import Auth from './service/authService.js'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import Swal from 'sweetalert2'


const Loginmember = () => {

    var history = useHistory();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const type = "สมาชิก";

    const validate = Yup.object({
        username: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
        password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
    });
    return (
        <div className="login-member-container">
            <div className="Navbar-container">
                <Navbar />
            </div>

            <div className="content-login-member-container">
                <div className="content-login-container">
                    <Formik
                    initialValues={{
                        username: "",
                        password: ""
                    }}
                    validationSchema={validate}
                    onSubmit={values=>{
                        Auth.loginmember(values.username, values.password)
                        .then(Response => {
                            console.log("Response ",Response)
                            if(Response.message){
                                Swal.fire({
                                    title: Response.message,
                                    icon: 'error',
                                    confirmButtonText: 'ตกลง'
                                  })
                            }else{
                                history.push("/member");
                            }
                            
                        })
                    }}
                    >
                    {({errors})=>(
                    <Form className="form-login-member">
                        <h1 id="head-login">เข้าสู่ระบบสำหรับสมาชิก</h1>
                        <div>
                            <p className='p-text'>ชื่อผู้ใช้*</p>
                            <Field type='text' className="text-input-username-loginmember" name='username'
                            style={errors.username && {border:'1px solid red'}}
                            ></Field>
                            <ErrorMessage component='div' name="username" className='error-text'/>
                        </div>
                        <div>
                            <p className='p-text'>รหัสผ่าน*</p>
                            <Field type="password" className="text-input-username-loginmember" name='password'
                            style={errors.password && {border:'1px solid red'}}
                            ></Field>
                            <ErrorMessage component='div' name="password" className='error-text'/>
                        </div>
                        <button className="button-login-member" type="submit">เข้าสู่ระบบ</button>
                        <hr />
                        <button className="buttonnew-member" type="submit">สร้างบัญชีใหม่</button>
                    </Form>
                    )}
                    </Formik>
                    <div className='image-container-loginmember'>
                        <img src={img} className="img-loginmember"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginmember;