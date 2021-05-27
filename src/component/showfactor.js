import { React, useEffect, useState } from "react";
import Axios from "axios";
import "./showfactor.css";
import D1 from "../img/icon/D1.png";
import { useHistory } from "react-router";
import alert from '../img/alert.png'
import Slider from 'react-slick'
import Swal from 'sweetalert2'

export default function Match() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/";
  const [factorlist, setFactorlist] = useState([]);
  const [weight, setWeight] = useState([]);
  const [count, setCount] = useState(0);
  const [arrayfactor, setArrayfactor] = useState([])
  const [statepair, setStatepair] = useState([])
  const [test, setTest] = useState('')
  const [pair, setPair] = useState([])
  var history = useHistory();
  useEffect(() => {
    Axios.get(url+"api/visitor/getfactor").then((Response) => {
      let data = Response.data
      let number = 0;
      for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
          pair.push({
            index: number, first: data[i].factor_ID, second: data[j].factor_ID
            , image1: data[i].image_Factor, image2: data[j].image_Factor
            , title1: data[i].factor_Title, title2: data[j].factor_Title
            , name1: data[i].factor_Name, name2: data[j].factor_Name
          })
          number++
        }

      }
      setFactorlist(Response.data)
    })
  }, []);

  const addfactor = (index) => e => {
    if (weight.length > 0) {
      var check = false;
      var INDEX = 0;
      for (let i = 0; i < weight.length; i++) {
        if (weight[i].index_Check == index) {
          check = true;
          INDEX = i;
        }
      }
      if (check == true) {
        const newWeight = [...weight];
        console.log("check true comparator: ", newWeight);
        newWeight[INDEX].factor_ID = e.target.value;
        setWeight(newWeight);

        statepair[INDEX] = e.target.value
      } else {
        setWeight([
          ...weight,
          { factor_ID: e.target.value, weight: 1, index_Check: index },
        ]);
        // setStatepair([...statepair,{e.target.value}])
        console.log(weight);
      }
    } else {
      setWeight([
        { factor_ID: e.target.value, weight: 1, index_Check: index },
      ]);
      console.log(weight);
    }
  };

  const isSelect = (index, factor) => {
    let checkstate = false
    for (let i = 0; i < weight.length; i++) {
      if (weight[i].index_Check == index) {
        if (weight[i].factor_ID == factor) {
          checkstate = true
          break
        } else {
          checkstate = false
        }
      } else {
        checkstate = false
      }
    }
    return checkstate
  }


  const isWeight = (index) => {
    let value = 1;
    for (let i = 0; i < weight.length; i++) {
      if (weight[i].index_Check == index) {
        value = weight[i].weight
      }
    }
    return value
  }




  // choose weight--------------------------------------------
  const addWeight = (index) => (e) => {
    if (weight.length > 0) {
      var check = false;
      var INDEX = 0;

      for (let i = 0; i < weight.length; i++) {
        if (weight[i].index_Check == index) {
          check = true;
          INDEX = i;
        }
      }

      if (check == true) {
        const newWeight = [...weight];
        console.log("check true weight: ", newWeight);
        newWeight[INDEX].weight = e.target.value;
        setWeight(newWeight);
      } else {
        setWeight([
          ...weight,
          { factor_ID: "", weight: e.target.value, index_Check: index },
        ]);
        console.log(weight);
      }
    } else {
      setWeight([
        { factor_ID: "", weight: e.target.value, index_Check: index },
      ]);
    }
  };

  const matchFac = (e) => {
    Axios.post(url+"api/visitor/matchDorm", weight)
      .then((Response) => {
        console.log(Response.data);
        history.push({
          pathname: "/matchVisitor",
          state: Response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [statecal, setStatecal] = useState(false)
  const [priority, setPriority] = useState([])


  const calPriority = (e) => {
    if (weight.length == pair.length) {
      let ischeck = validate(count)
      if (ischeck == true) {
        Axios.post(url+"api/visitor/calPriority", weight)
          .then((Response) => {
            let value = Response.data
            for (let i = 0; i < value.length; i++) {
              setPriority(prev => [...prev, { factor: factorlist[i], value: value[i] }])
              console.log("value: ", value[i])
            }
            setStatecal(true)
          })
          .catch((error) => {
            console.log(error);
          })
      } else {
        Swal.fire({
          title: 'กรุณากดเลือกปัจจัย',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        })
      }
    } else {
      Swal.fire({
        title: 'กรุณากดเลือกปัจจัย',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      })
    }

  }


  const validate = (index) => {
    let check = false
    weight.map(data => {
      if (data.index_Check == index) {
        if (data.factor_ID) {
          return check = true
        } else {
          return check = false
        }
      }
    })
    return check
  }

  const showpriority = () => {
    let value = [...priority]
    value.sort((a, b,) => b.value - a.value)
    console.log("value in showpriority ", value)
    return (
      <div className="result-cal-container">
        <h1 className='result-cal-priority-label'>ผลการวิเคราะห์คุณลักษณะส่วนบุคคลของคุณ</h1>
        <div className='result-cal-priority-container'>
          <table className='table-cal-priority'>
            <thead>
              {value.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <h3 className='result-text'> คุณให้ความสำคัญกับ <span className="factor-result-cal">{item.factor.factor_Title}</span> </h3>
                    </td>
                    <td>
                      <h3 className='factor-result-cal'>{Math.round(parseInt(item.value * 100))}%</h3>
                    </td>
                    <td>
                      <img className="icon-factor-result" src={url+"images/" + item.factor.image_Factor} />
                    </td>
                  </tr>
                )
              })}
            </thead>
          </table>
        </div>
        <button className="btn-match-dorm" onClick={matchFac}>จับคู่หอพัก</button>
      </div>
    )
  }




  const showArray = pair.map((item, key) =>
    <div className="match-block-container" key={key}>
      <h1 className="head-h1-match">กรุณาทำแบบสอบถามเบื้องต้นเพื่อประเมินความสนใจของคุณ</h1>
      <div className="showfactor-right-box">
        <h2>ความหมายของปัจจัยในการตัดสินใจเลือกหอพัก</h2>
        {factorlist.map((data, key) => {
          return (
            <div key={key} className="detail-factor-visitor">
              <img
                src={url+"images/" + data.image_Factor}
                width="50"
                height="50"
              ></img>
              <h3>{data.factor_Title} :</h3>
              <p className="Fn-visitor">{data.factor_Name}</p>
            </div>
          );
        })}
      </div>
      <div className="containermatch2-visitor">
        <h2 className="head-h2-match">คุณคิดว่าปัจจัยในด้านใดจำเป็นต่อตัวคุณมากที่สุด</h2>
      </div>
      <div id="contain-match-display" >
        <label className='radio-container'>
          <input id='radio-btn1' type='radio' defaultChecked={isSelect(key, item.first)} name={item.index} value={item.first} onChange={addfactor(key)} />
          <div className="box-match" id="box-match-1" >
            <img
              className="img-match-visitor"
              src={url+"images/" + item.image1}
              width="140px"
              height="140px"
            ></img>
            <h4>{item.title1}</h4>
          </div>
        </label>

        <label className='radio-container' >
          <input type='radio' id='radio-btn' defaultChecked={isSelect(key, item.second)} name={item.index} value={item.second} onChange={addfactor(key)} />
          <div className="box-match" id="box-match-2" >
            <img
              className="img-match-visitor"
              src={url+"images/" + item.image2}
              width="140px"
              height="140px"
            ></img>
            <h4>{item.title2}</h4>
          </div>
        </label>

      </div>
      <div className="range-weight-container">
        <h2 className="head-h2-match">คุณคิดว่าปัจจัยที่คุณเลือกมีความสำคัญกว่าอีกปัจจัยเท่าใด</h2>
        <div className="input-range-container">
          <p>เท่ากัน</p>
          <input type="range" defaultValue={isWeight(key)} className="input-range-match" min="1" max="9" onChange={addWeight(key)} />
          <p>มากที่สุด</p>
        </div>
      </div>
      <div className="button-match-container">
        {count != 0 ? <button className="button-back" onClick={(e) => {
          setCount(count - 1)
        }}>ย้อนกลับ</button> : <></>}
        {count != pair.length - 1 ? <button className="button-next" onClick={(e) => {
          let ischeck = validate(count)
          if (ischeck == true) {
            setCount(count + 1)
          } else {
            Swal.fire({
              title: 'กรุณากดเลือกปัจจัย',
              icon: 'warning',
              confirmButtonText: 'ตกลง'
            })
          }
        }}>ถัดไป</button> : <button className='btn-cal' onClick={calPriority}>แสดงผลลัพธ์</button>}
      </div>
      <div className="clear"></div>
    </div>
  )




  return (
    <div className="container-visitor">
      <div className="container-match-visitor">
        <div className="container-inner-match-visitor">
          <h1 className="head-match-dorm">จับคู่หอพัก</h1>
          {statecal == false ? showArray[count] : showpriority()}
        </div>
      </div>
    </div>
  );
}
