import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
function AddAgent(){
    useEffect(() => {
        const fetcategories = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get('http://agentapp1.runasp.net/api/Category', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setcategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };

        fetcategories();
    }, []);
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [ssn,setssn]=useState('');
    const [num,setnum]=useState('');
    const [email,setemail]=useState('');
    const [bussnisId,setbussnisId]=useState();
    const [status,setstatus]=useState(true);
    const [categories,setcategories]=useState([]);
    const [choseCategories,setchoseCategories]=useState([])
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setchoseCategories(selectedOptions);
      };
    const addAgent=async ()=>{
         if(username==="" ||password==="" || ssn==="" || num==="" ||email==="" || choseCategories.length===0 ||bussnisId===""){
            toast.error('Please fill all fields');
         }else{
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.post(`http://agentapp1.runasp.net/api/Organization/${organization}/Agents`, {
                    userStatus: status,
                    businessUserId: bussnisId, 
                    username: username,
                    userPassword: password,
                    userMobileNumber: num,
                    userNationalId: ssn,
                    userEmail: email,
                    categoriesIds:choseCategories,
                    orgAdminId:(JSON.parse(sessionStorage.getItem('user'))).id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                toast.success('Agent  added successfully!');
                setusername('');
                setpassword('');
                setssn('');
                setnum('');
                setemail('');
                setbussnisId();
                setchoseCategories([]);

                
            } catch (error) {
                console.error('Error', error);
                toast.error('Failed to add Agent.');
            }

            }
    }
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3 className='text-color'>اضافة عامل  </h3>
            <div className='org-par'>
                <div>
                    <label>اسم المستخدم</label>
                    <input className='border-outline' type='text' value={username} onChange={e => setusername(e.target.value)}/>
                </div>
                <div>
                    <label>كلمة مرور المستخدم</label>
                    <input className='border-outline' type='password' value={password} onChange={e => setpassword(e.target.value)}/>
                </div>
                <div>
                    <label>رقم الهاتف</label>
                    <input className='border-outline' type='number' value={num} onChange={e => setnum(e.target.value)}/>
                </div>
                <div>
                    <label>الرقم القومى</label>
                    <input className='border-outline' type='text' value={ssn} onChange={e => setssn(e.target.value)}/>
                </div>
                <div>
                    <label>البريد الالكترونى للمستخدم</label>
                    <input className='border-outline' type='email' value={email} onChange={e => setemail(e.target.value)}/>
                </div>
                <div>
                    <label>كود مستخدم الاعمال</label>
                    <input className='border-outline' type='number' value={bussnisId} onChange={e => setbussnisId(e.target.value)}/>
                </div>
                <div>
                    <label>الحالة</label>
                    <select className='border-outline' value={status} onChange={e => setstatus(e.target.value)}>
                        <option value={true}>نشط</option>
                        <option value={false}>غير نشط</option>
                    </select>
                </div>
                <div>
                    <label>الفئة</label>
                    <select className='border-outline'  multiple value={choseCategories} onChange={handleCategoryChange}>
                    {categories.map((c, index) => (
                        <option key={index} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                </div>
            </div>
            <button onClick={addAgent}>اضافة</button>
            <ToastContainer />
        </div>
    )

}
export default AddAgent;