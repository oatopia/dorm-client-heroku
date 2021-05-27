import { React, useEffect, useState } from "react";
import Axios from "axios";
import "./Match-member.css";
import { useHistory } from "react-router-dom";
import authHeader from "../../service/auth-header.js";
import Auth from "../../service/authService.js";
import Swal from 'sweetalert2'

export default function Match() {
  const url = "https://matching-dorm-tu-server.herokuapp.com/"
  const [factorlist, setFactorlist] = useState([]);
  const [weight, setWeight] = useState([]);
  const [pair, setPair] = useState([]);
  const [getweight, setGetweight] = useState([]);
  var history = useHistory();
  const currentUser = Auth.getCurrentUser();
  const [GETResponse, setGETResponse] = useState(false);
  const [state, setState] = useState(false);
  const [count, setCount] = useState(0);
  const [statecal, setStatecal] = useState(false)
  const [priority, setPriority] = useState([])
  const [checkweight, setCheckweight] = useState(false)
  const [checkpair, setCheckpair] = useState(false)
  const [checkpriority, setCheckpriority] = useState(false)

  useEffect(() => {
    Axios.post(
      url+"api/match/getWeight",
      { member_ID: currentUser.member_ID },
      { headers: authHeader() }
    )
      .then((Response) => {
        let obj = Response.data
        console.log("Respone from get weight", Response.data);
        if (obj) {
          console.log("Get!!!!");
          console.log("Response ", obj);
          if (obj.weight.length > 0) {
            setCheckweight(true)
            setCheckpriority(true)
          } else {
            setCheckweight(false)
            setCheckpair(true)
          }
          setWeight(obj.weight)
          setFactorlist(obj.factor)
          setPair(obj.pair)
          setPriority(obj.attribute)
        } else {
          console.log("not get!!!");
        }
      })
      .catch((err) => {
        console.log("Error from get Weight", err);
      });
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
        newWeight[INDEX].factor_ID = parseInt(e.target.value);
        setWeight(newWeight);
      } else {
        setWeight([
          ...weight,
          { factor_ID: parseInt(e.target.value), weight: 1, index_Check: index },
        ]);
        console.log(weight);
      }
    } else {
      setWeight([
        { factor_ID: parseInt(e.target.value), weight: 1, index_Check: index },
      ]);
      console.log(weight);
    }
  };


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
        newWeight[INDEX].weight = parseInt(e.target.value);
        setWeight(newWeight);
      } else {
        setWeight([
          ...weight,
          { factor_ID: null, weight: parseInt(e.target.value), index_Check: index },
        ]);
        console.log(weight);
      }
    } else {
      setWeight([
        { factor_ID: null, weight: parseInt(e.target.value), index_Check: index },
      ]);
    }
  };


  const isSelect = (number, factor) => {
    let checkstate = false
    for (let i = 0; i < weight.length; i++) {
      if (weight[i].index_Check == number) {
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


  const isWeight = (number) => {
    let value = 1;
    for (let i = 0; i < weight.length; i++) {
      if (weight[i].index_Check == number) {
        value = weight[i].weight
      }
    }
    return value
  }



  const calPriority = (e) => {
    let ischeck = validate(count)
    if (ischeck == true) {
      if (checkweight == true) {
        const payload = {
          member_ID: currentUser.member_ID,
          data: weight
        };
        Axios.put(url+"api/match/editWeight", payload, { headers: authHeader() })
        Axios.post(url+"api/match/calPriority", weight, { headers: authHeader() })
          .then((Response) => {
            let value = Response.data
            console.log("calPriority value", value)
            for (let i = 0; i < value.length; i++) {
              setPriority(prev => [...prev, { factor: factorlist[i], value: value[i] }])
            }
            setCheckpair(false)
            setStatecal(true)
          })
          .catch((error) => {
            console.log(error);
          });

      } else {

        const arrayweight = [];
        for (let i = 0; i < weight.length; i++) {
          weight.map((data) => {
            if (data.index_Check == i) {
              arrayweight.push(data);
            }
          });
        }
        console.log("save weight: ", arrayweight);
        const payload = {
          member_ID: currentUser.member_ID,
          data: arrayweight,
        };
        Axios.post(url+"api/match/createweight", payload, { headers: authHeader() })
        Axios.post(url+"api/match/calPriority", weight, { headers: authHeader() })
          .then((Response) => {
            let value = Response.data
            console.log("calPriority value", value)
            for (let i = 0; i < value.length; i++) {
              setPriority(prev => [...prev, { factor: factorlist[i], value: value[i] }])
            }
            setCheckpair(false)
            setStatecal(true)
          })
          .catch((error) => {
            console.log(error);
          });
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


  const matchFac = () => {
    Axios.post(url+"api/match/matchDorm", weight, { headers: authHeader() })
      .then((Response) => {
        console.log(Response.data);
        history.push({
          pathname: "/resultmatch",
          state: Response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }




  const Showpair = () => {

    let paring = pair.map((obj, key) => {
      return (
        <div>
          <div id="contain-match-display" >
            <label className='radio-container'>
              <input id='radio-btn1' type='radio' defaultChecked={isSelect(key, obj.factor_ID1)} name={obj.index} value={obj.factor_ID1} onChange={addfactor(key)} />
              <div className="box-match" id="box-match-1" >
                <img
                  className="img-match-visitor"
                  src={url+"images/" + obj.image_Factor1}
                  width="140px"
                  height="140px"
                ></img>
                <h4>{obj.factor_Title1}</h4>
              </div>
            </label>

            <label className='radio-container' >
              <input type='radio' id='radio-btn' defaultChecked={isSelect(key, obj.factor_ID2)} name={obj.index} value={obj.factor_ID2} onChange={addfactor(key)} />
              <div className="box-match" id="box-match-2" >
                <img
                  className="img-match-visitor"
                  src={url+"images/" + obj.image_Factor2}
                  width="140px"
                  height="140px"
                ></img>
                <h4>{obj.factor_Title2}</h4>
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
        </div>
      )
    })
    return (
      <div className="match-block-container">
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
        {paring[count]}
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
          }}>ถัดไป</button> : <button className='btn-cal' onClick={calPriority} >แสดงผลลัพธ์</button>}
        </div>
        <div className="clear"></div>
      </div>
    )
  }

  const Showpriority = () => {
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


  const ShowResult = () => {
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
        <div className="btn-contain">
          <button className="btn-edit-dorm" onClick={(e) => {
            setCheckpriority(false)
            setCheckpair(true)
            setPriority([])
          }}>แก้ไขคุณลักษณะ</button>
          <button style={{marginRight:"20px"}} className="btn-match-dorm" onClick={matchFac}>จับคู่หอพัก</button>
        </div>

      </div>
    )
  }



  return (

    <div className="container-visitor">
      <div className="container-match-visitor">
        <div className="container-inner-match-visitor">
          <h1 className="head-match-dorm">จับคู่หอพัก</h1>
          {checkpriority == true && <ShowResult />}
          {checkpair == true && <Showpair />}
          {statecal == true && <Showpriority />}
        </div>
      </div>
    </div>

  );
}
