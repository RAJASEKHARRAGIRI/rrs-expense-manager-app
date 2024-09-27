import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login"
import Register from "./components/Register"
import { Routes,Route, Navigate, Outlet} from "react-router-dom";
import HomeDashboardComponent from "./components/HomeDashboard"
import Settings from "./components/Settings"
import AppUsersList from "./components/AppUsersList"
import ConfigExpenses from "./components/ConfigExpenses"
import ExpensesList from "./components/ExpensesList"
import Profile from "./components/Profile"
import PageNotFound from "./common/not-found"
import Pageloading from "./common/loading-page"
import 'react-toastify/dist/ReactToastify.css';
import useLocalStorage from './common/useLocalStorage-customHook';

export default function App() {
  const [userInfo, setUserInfo] = useLocalStorage('logged_in_user', null);

  const setUser = (user) => {
    setUserInfo(user);
  };

  const logoutUser = () => {
    setUserInfo(null);
  };

  return (
    <>  
      <Routes>
        <Route path="/" element={<Login setUser={setUser} userInfo={userInfo}/>}/>
        <Route path="/register" element={<Register userInfo={userInfo}/>} />   
        <Route path="/loadingPage"  element={<Pageloading/>}/>   
        <Route path="/rrsexpense"  onEnter={() => console.log('Entered /')} element={<Navbar logoutUser={logoutUser} userInfo={userInfo} />} >
          <Route index element={<HomeDashboardComponent userInfo={userInfo}/>}/>
          <Route path="/rrsexpense/settings" element={<Settings/>}/>
          <Route path="/rrsexpense/users" element={<AppUsersList/>}/>
          <Route path="/rrsexpense/config" element={<ConfigExpenses/>}/>
          <Route path="/rrsexpense/expenses" element={<ExpensesList/>}/>
          <Route path="/rrsexpense/profile" element={<Profile userInfo={userInfo}/>}/>
          <Route path="/rrsexpense/pagenotfound" element={<PageNotFound userInfo={userInfo}/>}/>
          <Route path="*" element={<PageNotFound userInfo={userInfo}/>}/>
        </Route>
        <Route path="*" element={<PageNotFound userInfo={userInfo}/>}/>
      </Routes>
    </>
  );
}
