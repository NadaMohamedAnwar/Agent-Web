import React from 'react';
import './style.css';
import logo from '../images/logo.png';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://agentapp1.runasp.net/api/user/Login', { username, password });
      const { token } = response.data;
      const { user } = response.data;
      sessionStorage.setItem('token', token); // Store token in localStorage
      sessionStorage.setItem('user', JSON.stringify(user));
      if(user.role===0){
        navigate('/admin-page');
      }
      if(user.role===1){
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Login error', error);
      toast.error('invalid credentials');
    }
  };
    return(
        <div className='parent'>
          <div className='col-sm-10 col-md-6 col-lg-4 par'>
            <div className='login-div border-outline'>
              <h2 className='text-color'>تسجيل الدخول</h2>
              <div className="input-container">
                <i className="far fa-user"></i>
                <input className='border-outline' required type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='ادخل اسم المستخدم'></input>
              </div>
              <div className="input-container">
                <i className="fas fa-lock"></i>
                <input className='border-outline' required type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='ادخل كلمة السر'></input>
              </div>
              <button onClick={handleLogin}>تسجيل الدخول</button>
            </div>
            <div className='logo-div'>
              <span>Powered by</span>
              <img src={logo} alt="Logo" className="logo" />
            </div>
          </div>
          <ToastContainer />
        </div>
    );
}
export default Login;