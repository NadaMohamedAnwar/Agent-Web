import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import axios from 'axios';
function AddCategory(){
    const [name,setname]=useState('');
    const [orgname,setorgname]=useState('');
    const [code,setcode]=useState('');
    const addclient=async()=>{
            if(name===""){
                toast.error('Please fill all fields');
            }else{
                try {
                    const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                    const response = await axios.post('http://agentapp1.runasp.net/api/Category', {
                        name: name,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Include token in Authorization header
                        }
                    });
                    setname('');
                    toast.success('Category added successfully!');
                } catch (error) {
                    console.error('Error', error);
                    toast.error('Failed to add Category.');
                }
            }
        
    }
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3>اضافة فئة </h3>
            <div className='org-par'>
                <div>
                    <label>اسم الفئة</label>
                    <input className='border-outline' type='text' value={name} onChange={e => setname(e.target.value)}/>
                </div>
            </div>
            <button onClick={addclient}>اضافة</button>
            <ToastContainer />
        </div>
    )

}
export default AddCategory;