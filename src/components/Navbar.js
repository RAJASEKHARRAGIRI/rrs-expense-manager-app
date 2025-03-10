import {useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate} from "react-router-dom";
import {RenderNavBarItems} from '../common/render-nav-items'
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';

export default function Navbar({ logoutUser, userInfo}) {

  const navigate = useNavigate();
  const [isNavBarOpen, setOpenNavBar] = useState(false);
  const op = useRef(null);

  useEffect(() => {
    if(!userInfo) {      
      navigate("/");
    }
  }, [userInfo]);

  const toggleNavBarClass = (e) => {
    e.preventDefault();
    setOpenNavBar(!isNavBarOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const navigateToRepo = () => {
    window.open(
        "https://github.com/RAJASEKHARRAGIRI/rrs-expense-manager-app", "_blank");
  };

  if (localStorage.getItem("light") === "set") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }

  return (
  <div className="wrapper">
      <aside id="sidebar" className= {isNavBarOpen ? 'js-sidebar collapsed': 'js-sidebar'}>          
          <div className="h-100">
              <div className="sidebar-logo">
                  <a href="#">
                  <img src={require("../images/logo.png")} className="avatar-logo img-fluid rounded" alt=""></img>&nbsp;RRS Creations</a>
              </div>
              <ul className="sidebar-nav">
                  <li className="sidebar-header">
                      Expense Manager Features <span className="badge bg-success">{userInfo?.role == "admin" ? "Admin" : "User"}</span>
                  </li>
                   <RenderNavBarItems></RenderNavBarItems>       
                  <div className="custom-hr"></div>
                  <li className="sidebar-item">
                      <a className="sidebar-link" onClick={navigateToRepo}>
                      <i class="fa-solid fa-circle-info"></i>&nbsp;
                          &nbsp;About
                      </a>
                  </li>
                  <li className="sidebar-item">
                      <a className="sidebar-link" onClick={handleLogout}>
                          <i className="fa-solid fa-power-off pe-2"></i>
                          &nbsp;Logout
                      </a>
                  </li>
              </ul>
          </div>
      </aside>
      <div className="main">
          <nav className="navbar navbar-expand px-3 border-bottom ">
              <button className="btn" id="sidebar-toggle" type="button" onClick={(e) => toggleNavBarClass(e)}>
                  <span className="navbar-toggler-icon"></span>
              </button>
              
                
              <div className="navbar-collapse navbar">
                  <ul className="navbar-nav ml-auto">
                    <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem', margin:"8px 20px" }}  onClick={(e) => op.current.toggle(e)} >
                    <Badge value="2"></Badge>
                    </i>
                    <OverlayPanel ref={op}>
                        <p>No notifications.</p>
                    </OverlayPanel>
                      <li className="nav-item dropdown">
                          <a href="#" data-bs-toggle="dropdown" className="nav-icon pe-md-0">
                              <img src={require("../images/profile.jpg")} className="avatar img-fluid rounded" alt=""></img>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end">
                              <NavLink href="#" className="dropdown-item" to="/rrsexpense/profile"> <i className="fa-solid fa-drivers-license pe-2"></i> User Profile</NavLink>
                              <NavLink href="#" className="dropdown-item" to="/rrsexpense/settings"><i className="fa-solid fa-gear pe-2"></i> App Settings</NavLink>
                              <a href="#" className="dropdown-item" onClick={handleLogout}><i className="fa-solid fa-power-off pe-2"></i> Logout</a>
                          </div>
                      </li>
                  </ul>
              </div>
          </nav>
        
          <main className="content px-3 py-2">           
            {/* All pages will route here like dashboard, setting, list etc */}
            {/* <div className="container-fluid"> */}
            <Outlet/>  
            {/* </div>           */}
          </main>
          <footer className="footer">
              <div className="container-fluid">
                  <div className="row text-muted">
                      <div className="col-4 text-start">
                          <p className="mb-0">
                              <a  className="text-muted footer-text">
                                  RRS Creations
                              </a>
                          </p>
                      </div>
                      <div className="col-8 text-end">
                          <ul className="list-inline">
                              <li className="list-inline-item">
                                  <a className="text-muted footer-text">All copy right reserved @2025</a>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </footer>
      </div>
      </div>
  );
};
