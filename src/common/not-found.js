import React from "react";
import {NavLink} from 'react-router-dom';

export default function PageNotFound({userInfo}) {
    return (
      <div>
        <div className="container">
        <div className="row align-items-center mt-6"  style={{marginTop:"20vh" }}>
            <div className="header-text mb-6 text-center">
              <img
                src={require("../images/logo.png")}
                style={{ width: 50, height: 50 }}
                className="avatar-logo img-fluid rounded"
                alt=""
              ></img>
              <h5>RRS Expense Manager</h5>
              <p><small>Track your expenses & income </small></p>
              {/* <p>We are happy to have you back.</p> */}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="text-center row">
              <div className=" col-md-6">
                <img
                  src={require("../images/404.png")}
                  style={{ width: 500 }}
                  className="img-fluid"
                ></img>
              </div>
              <div className=" col-md-6 mt-5">
                <p className="fs-3">
                  {" "}
                  <span className="text-danger">Opps!</span> Page not found.
                </p>
                <p className="lead">
                  The page you’re looking for doesn’t exist.
                </p>
                <NavLink to={userInfo ? "/rrsexpense" : "/"} className="btn btn-primary">
                  Go Home
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};