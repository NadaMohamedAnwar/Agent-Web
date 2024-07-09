import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
function AddClient(){
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
                setcategory(response.data[0].id)
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };

        fetcategories();
    }, []);

    const [name,setname]=useState('');
    const[contactname,setcontactname]=useState('');
    const [accountAderss,setaccountAderss]=useState('');
    const [num,setnum]=useState('');
    const [contactAddress,setcontactAddress]=useState('');
    const [customerType,setcustomerType]=useState(0);
    const [category,setcategory]=useState();
    const [categories,setcategories]=useState([]);
    const addclient=async ()=>{
         if(name==="" || category==="" || accountAderss==="" || num==="" ||contactAddress===""){
            toast.error('Please fill all fields');
         }else{
            try {
                const token = sessionStorage.getItem('token');

                const response = await axios.post('http://agentapp1.runasp.net/api/Client', {
                    accountAddress: accountAderss, // Assuming status is a string like "true" or "false"
                    accountName: name,
                    contactMobileNumber: num,
                    customerType: customerType,
                    contactAddress: contactAddress,
                    categoryId:category,
                    contactName:contactname,
                    organizationId:(JSON.parse(sessionStorage.getItem('user'))).organizationId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                setname('');
                setaccountAderss('');
                setnum('');
                setcontactAddress('');
                setcategory();
                setcontactname('');
                toast.success('Client added successfully!');
            } catch (error) {
                console.error('Error', error);
                toast.error('Failed to add client.');
            }
         }
    }
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3>اضافة عميل </h3>
            <div className='org-par'>
                <div>
                    <label>اسم الحساب</label>
                    <input className='border-outline' type='text' value={name} onChange={e => setname(e.target.value)}/>
                </div>
                <div>
                    <label>اسم التواصل</label>
                    <input className='border-outline' type='text' value={contactname} onChange={e => setcontactname(e.target.value)}/>
                </div>
                <div>
                    <label>رقم الهاتف</label>
                    <input className='border-outline' type='number' value={num} onChange={e => setnum(e.target.value)}/>
                </div>
                <div>
                    <label>عنوان الحساب</label>
                    <input className='border-outline' type='text' value={accountAderss} onChange={e => setaccountAderss(e.target.value)}/>
                </div>
                <div>
                    <label>عنوان التواصل</label>
                    <input className='border-outline' type='text' value={contactAddress} onChange={e => setcontactAddress(e.target.value)}/>
                </div>
                <div>
                    <label>الفئة</label>
                    <select onChange={e => setcategory(e.target.value)}>
                        {categories.map((c, index) => (
                            <option key={index} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>نوع العميل</label>
                    <select value={customerType} onChange={e => setcustomerType(e.target.value)}>
                       <option value={0}>business</option>
                       <option value={1}>Consumer</option>
                       <option value={2}>Merchant</option>
                    </select>
                 </div>
            </div>
            <button onClick={addclient}>اضافة</button>
            <ToastContainer />
        </div>
    )

}
export default AddClient;