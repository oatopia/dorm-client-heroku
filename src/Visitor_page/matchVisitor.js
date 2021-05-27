import { React, useEffect, useState } from 'react';
import './matchVisitor.css';
import Navbar from '../component/Navbar/Navbar.js';
import Axios from 'axios'
import { useHistory, useLocation } from 'react-router';
import imagetest from '../img/livingroom1.jpg'
import { Prev } from 'react-bootstrap/esm/PageItem';

function MatchVisitor() {
    const url = "https://matching-dorm-tu-server.herokuapp.com/"
    let history = useHistory();
    let location = useLocation();
    let payload = location.state;
    const [dorm, setDorm] = useState([])
    useEffect(() => {
        window.scrollTo(0, 0)
        Axios.get(url+"api/visitor/getdetail").then((Response) => {
            let data = Response.data
            console.log(data)
            payload.forEach(element => {
                let getimg = data[0].filter(item => item.dorm_ID == element.dorm_ID)
                let getroom = data[1].filter(item => item.dorm_ID == element.dorm_ID)
                let getfacility = data[2].filter(item => item.dorm_ID == element.dorm_ID)
                setDorm(prev => [...prev, {
                    Image: getimg,
                    Room: getroom,
                    Facility: getfacility,
                    Dorm: element
                }])
            })
        })
    }, []);

    return (
        <div>
            <div className='Navbar-shadow-box'>
            <Navbar />
            </div>
            <div className="result-container">
                {dorm.map((data, key) => {
                    return (
                        <div className="dorm-container" key={key} onClick={() => {
                            history.push({
                                pathname: "/dormvisitor",
                                state: data,
                            })
                        }}>
                            <div className="start-result-box">
                                <img className='img-dorm-box' src={url+"img_Dorm/" + data.Image[0].image}></img>
                                <h1>หอพัก{data.Dorm.dorm_Name}</h1>
                            </div>
                            <div className="end-result-box">
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

export default MatchVisitor;