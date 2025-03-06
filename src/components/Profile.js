import React, { useState, useEffect, useRef } from "react";
import * as AppConstants from "../common/constants";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import * as CommonFunctions from "../common/CommonFunctions"

export default function Profile({userInfo}) {
  const [userInfoState, setUserInfoState] = useState(userInfo);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let payload = {
      id: userInfoState.id,
      userName: userInfoState.userName,
      fullName: data.get("fullname"),
      password: userInfoState.password,
      email: data.get("email"),
      gender: data.get("inlineRadioOptions"),
      phoneNumber: data.get("phoneNo"),
      location: data.get("location"),
      salary: data.get("salary"),
      updatedOn: CommonFunctions.GetCurrentDateTime()
    };

    //update user
    fetch(`${AppConstants.jsonServerApiUrl}/users/${userInfoState.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        toast.success("Profile successfully updated");
        res.json().then((res) =>{
          window.localStorage.setItem("logged_in_user", JSON.stringify(res));
          setUserInfoState(res);
          document.getElementById("userForm").reset();
        });
      })
      .catch((error) => {
        toast.error(`${error.message}, failed to register.`);
      });
  };

  const clearForm =() =>{
    document.getElementById("userForm").reset();
    toast.info(`Form cleared successfully.`);
  }

  const editButtonClick = () => {
    document.getElementById('fullname').value = userInfoState.fullName;
    document.getElementById('email').value = userInfoState.email ;
    document.getElementById('phoneNo').value = userInfoState.phoneNumber;
    if(userInfoState.gender === 'male' || userInfoState.gender === 'female'){
      document.getElementById(userInfoState.gender).checked = true;
    } 
    document.getElementById('location').value = userInfoState.location ;
    document.getElementById('salary').value = userInfoState.salary ;
  }

  return (
    <>
     <CommonToastContainer/>
      <div className="mb-3">
        <h4>User Profile</h4>
      </div>
      <div className="row">
        <div className="col-sm-12 col-xl-7 ">
          <div className="card mb-3" >
            <div className="row g-0">
              <div className="col-md-7 col-xxl-5 col-xl-5">
                <img 
                  src={require(`../images/${userInfoState.gender == "female" ? "profile_girl.jpg" :"profile.jpg"}`)}
                  className="card-img-top img-fluid w-100 h-100"
                  alt="..."
                ></img>
              </div>
              <div className="col-md-5 col-xxl-7 col-xl-7">
                <div className="card-body">
                  <h5 className="card-title"> {userInfoState.fullName} 
                  <a href="#" onClick={editButtonClick}><i className="fa-solid fa-edit pe-2 float-end"></i></a></h5>
                  
                  <div className="card-text">
                    <p className="mb-1"><strong>Gender : </strong> {userInfoState.gender} </p>
                    <p className="mb-1"><strong>Email : </strong> {userInfoState.email} </p>
                    <p className="mb-1"><strong>Phone No : </strong> {userInfoState.phoneNumber}</p>
                    <p className="mb-1"><strong>Location : </strong> {userInfoState.location} </p>
                    <p className="mb-1"><strong>Monthly Income : </strong> Rs. {userInfoState.salary} /-</p>
                    <p className="mb-1"><strong>User Name : </strong> {userInfoState.userName} </p>
                    <p className="mb-1"><strong>Role : </strong> {userInfoState?.role == "admin" ? "Admin" : "Normal User"} </p>
                    <p className="mb-1"><strong>Password : </strong>  {userInfoState.password}</p>
                  </div>
                </div>
                <div className="card-footer" style={{background: "white", borderTop:"none"}}>
                <p className="card-text ">
                    <small>
                    <i className="fa fa-history" aria-hidden="true"></i> Updated on {userInfoState.updatedOn}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xl-5">
          <form onSubmit={handleSubmit} id="userForm" className="was-validated form-custom-styles">
            <div className="input-group mb-3">
            <span className="input-group-text"><small>Full Name</small></span>
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"
                id="fullname"
                name="fullname"
                autoComplete="off"
                autoFocus
                required
              ></input>
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text"><small>Email</small></span>
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"                
                id="email"
                name="email"
                autoComplete="off"
                required
              ></input>
            </div>

            <div className="input-group mb-2">
            <span className="input-group-text"><small>Phone No</small></span>
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"                
                id="phoneNo"
                name="phoneNo"
                required
              ></input>
            </div>


            <div className="input-group mb-2">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="male" value="male"></input>
                <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
              </div>
              <div className="form-check form-check-inline mb-0">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="female" value="female"></input>
                <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
              </div>
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text"><small>Location</small></span>
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"
                id="location"
                name="location"
                required
              ></input>
            </div>

            <div className="input-group mb-3">
            <span className="input-group-text"><small>Monthly Income</small></span>
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"
                id="salary"
                name="salary"
                required
              ></input>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button
                className="btn btn-lg btn-warning w-100 fs-6 rounded-5"
                type="submit"
              >
                Update profile&nbsp;
                <i className={`fa-solid fa-chevron-right pe-2`}></i>
              </button>
              <button type="button" onClick={clearForm} className="btn btn-lg btn-default fs-6 rounded-5">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
