import React, { useState, useEffect, useRef } from "react";
import { Divider } from 'primereact/divider';

export default function Settings() {
  const [isChecked, setIsChecked] = useState(
    localStorage.getItem("light") == "set" ? true : false
  );

  const handleToggle = () => setIsChecked(!isChecked);

  React.useEffect(() => {
    toggleTheme();
  }, [isChecked]);

  const toggleTheme = () => {
    toggleLocalStorage();
    toggleRootClass();
  };

  const toggleRootClass = () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const inverted = current == "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", inverted);
  };

  const toggleLocalStorage = () => {
    if (localStorage.getItem("light")) {
      localStorage.removeItem("light");
    } else {
      localStorage.setItem("light", "set");
    }
  };

  if (localStorage.getItem("light") === "set") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }

  return (
    <>
      <div className="mb-3">
        <h4>Settings</h4>
      </div>

      <div className="row">
        <h6>
          <small>Change application theme (Light/Dark):</small>
        </h6>
        <div className="col-12 col-md-6 d-flex">
        {isChecked ? (
              <i className="fa-regular fa-moon" style={{padding:'4px'}}></i>
            ) : (
              <i className="fa-regular fa-sun" style={{padding:'4px'}}></i>
            )}{" "}
            &nbsp;
            <label className="form-check-label">
              {isChecked ? "Dark Mode " : "Light Mode "}&nbsp;
            </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="mySwitch"
              checked={isChecked}
              onChange={handleToggle}
              style={{ cursor: "pointer" }}
            ></input>
          </div>
        </div>
        <Divider />
        <h6>
          <small>Change system notifications (on/off):</small>
        </h6>
        <div className="col-12 col-md-6 d-flex">
        <i className="pi pi-bell" style={{padding:'4px'}}></i> &nbsp;
            <label className="form-check-label">Turn on/off &nbsp;</label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              style={{ cursor: "pointer" }}
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}
