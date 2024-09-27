import React, { useState, useEffect, useRef } from "react";
import * as AppConstants from "../common/constants";
import * as CommonFunctions from "../common/CommonFunctions";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import CommonToastContainer from "../common/ToastAlert"
import { InputText } from 'primereact/inputtext';

export default function UserModal({ userInfo, closeUserModal }) {
  const [userInfoState, setUserInfoState] = useState(userInfo);
  const [closeModal1, setCloseModal1] = useState(true);
  

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
      updatedOn: CommonFunctions.GetCurrentDateTime(),
    };

    //update user
    fetch(`${AppConstants.jsonServerApiUrl}/users/${userInfoState.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        toast.success("Profile successfully updated");
        res.json().then((res) => {
          window.localStorage.setItem("logged_in_user", JSON.stringify(res));
          setUserInfoState(res);
          document.getElementById("userForm").reset();
          closeModal(true);
        });
      })
      .catch((error) => {
        toast.error(`${error.message}, failed to register.`);
      });
  };

  const closeModal = (flag) => {   
    userInfoState.showModal = flag;
    setCloseModal1(false);
    closeUserModal();
  }

  const clearForm = () => {
    document.getElementById("userForm").reset();
    toast.info(`Form cleared successfully.`);
  };

  useEffect(() => {    
    if(userInfoState) {
      setTimeout(() => {
        loadFormData();
      }, 100);
    }
  }, []);

  const loadFormData = () => {
    document.getElementById("fullname").value = userInfoState.fullName;
    document.getElementById("email").value = userInfoState.email;
    document.getElementById("phoneNo").value = userInfoState.phoneNumber;
    if (userInfoState.gender === "male" || userInfoState.gender === "female") {
      document.getElementById(userInfoState.gender).checked = true;
    }
    document.getElementById("location").value = userInfoState.location;
    document.getElementById("salary").value = userInfoState.salary;
  };

  const footerContent = (
    <div>
      {/* <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => closeModal(false)}
        className="p-button-text"
      /> */}
      {/* <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => closeModal(false)}
        autoFocus
      /> */}
    </div>
  );

  return (
    <>
      <CommonToastContainer />
      <Dialog
        header="Update user"
        visible={closeModal1}
        style={{ width: "30vw" }}
        onHide={() => closeModal(false)}
        className="prime_dialog"
        // footer={footerContent}
      >
        <div className="row">
          <div className="col-sm-12">
            <form
              onSubmit={handleSubmit}
              id="userForm"
              className="was-validated form-custom-styles"
            >
              <div className="mb-2">
                <label htmlFor="fullName" className="form-label form-label-class"> {/** fw-bold */}
                 Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullname"
                  placeholder="Enter your full name"
                  name="fullname"
                  autoComplete="off"
                  autoFocus
                  required
                />
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="form-label form-label-class">
                Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter Email Id"
                  name="email"
                  autoComplete="off"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="phoneNo" className="form-label form-label-class">
                Phone Number
                </label>
                <input
                  type="number"
                  maxLength={10}
                  min={0}
                  max={1000000000}
                  className="form-control"
                  id="phoneNo"
                  placeholder="Enter Phone Number"
                  name="phoneNo"
                  autoComplete="off"
                />
              </div>

              <div className="input-group mb-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="male"
                    value="male"
                  ></input>
                  <label className="form-check-label" htmlhtmlFor="inlineRadio1">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="female"
                    value="female"
                  ></input>
                  <label className="form-check-label" htmlhtmlFor="inlineRadio2">
                    Female
                  </label>
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="location" className="form-label form-label-class">
                Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="Enter Location"
                  name="location"
                  autoComplete="off"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="salary" className="form-label form-label-class">
                Monthly Income
                </label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="salary"
                  placeholder="Enter Salary"
                  name="salary"
                  autoComplete="off"
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-lg btn-warning w-100 fs-6 rounded-5"
                  type="submit"
                >
                  Update profile&nbsp;
                  <i className={`fa-solid fa-chevron-right pe-2`}></i>
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="btn btn-lg btn-default fs-6 rounded-5"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}
