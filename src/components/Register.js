import { React, useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as AppConstants from "../common/constants";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import * as CommonFunctions from "../common/CommonFunctions"

export default function SignUp({userInfo}) {
  const navigate = useNavigate();
  useEffect(() => {
    if(userInfo) {      
      navigate("/rrsexpense");
    }
  }, [userInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let payload = {
      userName: data.get("userid"),
      fullName: data.get("fullname"),
      password: data.get("password"),
      gender: '',
      email:'',
      phoneNumber:'',
      location:'',
      salary:'',
      updatedOn: CommonFunctions.GetCurrentDateTime()
    };

    //save user
    fetch(`${AppConstants.jsonServerApiUrl}/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        alert("Congratulations, you have successfully registered.");
        navigate("/");
      })
      .catch((error) => {
        toast.error(`${error.message}, failed to register.`);
      });
  };

  return (
    <div className="login-form">
      <CommonToastContainer/>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 ">
        <div className="row border rounded-5 p-3 bg-white shadow box-area">
          <div
            className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box d-none d-sm-block"
            style={{ background: "#798cc1" }}
          >
            <div className="featured-image mb-3">
              <img
                src={require("../images/1.png")}
                className="img-fluid"
                style={{ marginwidth: "350px" }}
              ></img>
            </div>
            <p className="text-white fs-6 ">Daily Expense Tracker System</p>
            <small className="text-white text-wrap text-center">
              It doesn't matter how much money you earn, what matters is how
              much you save. Use RRS Expenses Manager to track your expenses &
              it is simple way to manage your personal finances.
            </small>
            <br />
            <p className="mt-3 ">
              <small className="text-white text-wrap text-center">
                “RRS Expenses Manager - Just Perfect!”.
              </small>
            </p>
          </div>

          <div className="col-md-6 right-box">
            <div className="row align-items-center">
              <div className="header-text mb-0 text-center">
                <img
                  src={require("../images/logo.png")}
                  style={{ width: 60, height: 60 }}
                  className="avatar-logo img-fluid rounded"
                  alt=""
                ></img>
                <h3>RRS Expense Manager</h3>
                <p>Track your expenses & income </p>
                {/* <p>We are happy to have you back.</p> */}
              </div>
              <form onSubmit={handleSubmit} className="was-validated">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light fs-6"
                    placeholder="Your Name"
                    id="fullname"
                    name="fullname"
                    autoComplete="off"
                    autoFocus
                    required
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light fs-6"
                    placeholder="User Name"
                    id="userid"
                    name="userid"
                    autoComplete="off"
                    required
                  ></input>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg bg-light fs-6"
                    placeholder="Password"
                    id="password"
                    name="password"
                    required
                  ></input>
                </div>

                {/* <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="iAgreeCheck"
                    name="iAgreeCheck"
                    required
                  ></input>
                  <label className="form-check-label" htmlFor="iAgreeCheck">
                    &nbsp;I have read & agree to the terms
                  </label>
                </div> */}

                <div className="input-group mb-3">
                  <button
                    className="btn btn-lg btn-warning w-100 fs-6 rounded-5"
                    type="submit"
                  >
                    Register&nbsp;
                    <i className={`fa-solid fa-chevron-right pe-2`}></i>
                  </button>
                </div>
              </form>
              <div className="row">
                <small>
                  Do you have account? <NavLink to="/">Login</NavLink>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row text-center">
          <a className="text-muted footer-text">
            All copy right reserved @2024 by RRS Creations
          </a>
        </div>
      </div>
    </div>
  );
}
