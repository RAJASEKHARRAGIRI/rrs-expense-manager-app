import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate  } from "react-router-dom";
import '../common/css/loading.css';
import { ProgressBar } from 'primereact/progressbar';

export default function Pageloading({setUser, userInfo}) {
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
    const interval = useRef(null);

    useEffect(() => {
        let _val = value;

        interval.current = setInterval(() => {
            _val += Math.floor(Math.random() * 10) + 1;

            if (_val >= 100) {
                _val = 100;
                clearInterval(interval.current);
                navigate("/rrsexpense");
            }
            setValue(_val);
        }, 100);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        };
    }, []);
 
  return (
    <div style={{"marginTop":"20%", padding:"0% 35%"}}>

    <div className="header1">
        <p><b>RRS Expense Manager</b></p>
      </div>
     <ProgressBar value={value}></ProgressBar>

      
      <div className="header">
        <p><b>Loading...</b></p>
      </div>
    </div>
  );
}
