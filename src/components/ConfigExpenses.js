import { React, useEffect } from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import * as AppConstants from "../common/constants";
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
export default function ConfigExpenses() {

  fetch(`${AppConstants.jsonServerApiUrl}/users`)
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {      
    toast.error(`${error.message}, Failed to fetch users data.`);
  });

  return (
    <>
     <CommonToastContainer/>
      <div className="mb-3">
        <h4>Config Expense Types</h4>        
        <img width="400px"
                src={require("../images/under-construction.png")}
                className="img-fluid"
                style={{ marginwidth: "350px" }}
              ></img>
      </div>
    </>
  );
}
