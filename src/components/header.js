import React, { useEffect, useRef ,useContext} from 'react'; 
import './style.css';
import { NavLink } from 'react-router-dom';
import logo from "../images/logo.png"
import { useNavigate } from 'react-router-dom';

function Header(){
    const user = JSON.parse(sessionStorage.getItem('user'));
    const s1=({isActive})=>{
        return{
          color: isActive ? "white" :"green",
          backgroundColor: isActive ? "#78B060" : "#CADBCA",
          fontWeight: isActive ?"bold" : "normal",
          textDecoration: "none"
        }

    }
    const s=()=>{
        return{
          color:"green",
          backgroundColor:"#CADBCA",
          fontWeight:"normal",
          textDecoration: "none"
        }

    }
    const navigate = useNavigate();
    const handlelogout = e => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem("user");
        navigate('/');
    
      };
    return(
        <div className='header'>
            
            <nav className="navbar navbar-expand-sm">
                <div className="container-fluid ">
                    <button className="navbar-toggler btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        {user && user.role === 0 &&(
                            <>
                                <NavLink style={s1} to={"/admin-page"}>المؤساسات</NavLink>
                                <NavLink style={s1} to={"/create-org"}>اضافة مؤسسة</NavLink>
                                <NavLink style={s1} to={"/create-org-admin"}>اضافة مشرف مؤسسة</NavLink>
                                <NavLink style={s1} to={"/add-category"}>اضافة فئة</NavLink>
                                <NavLink style={s} onClick={handlelogout}>تسجيل الخروج</NavLink>
                            </>
                        )}
                        {user && user.role === 1 &&(
                                <>
                                    <NavLink style={s1} to={"/tasks"}>المهام</NavLink>
                                    <NavLink style={s1} to={"/add-checklist"}>اضافة قائمة </NavLink>
                                    <NavLink style={s1} to={"/add-client"}>اضافة عميل</NavLink>
                                    <NavLink style={s1} to={"/add-agent"}>اضافة عامل</NavLink>
                                    <NavLink style={s1} to={"/create-schedule"}>اضافة مهمة</NavLink>
                                    <NavLink style={s} onClick={handlelogout}>تسجيل الخروج</NavLink>
                                 </>
                            )
                        }
                    </div>
                </div>
            </nav>
            <div className='logo-content'>
            <img src={logo} alt="Logo" className='logo'></img>
            </div>

        </div>
    )
}
export default Header;