import React, { useState } from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function CreateOrg() {
    const [name, setname] = useState('');
    const [account, setaccount] = useState('');
    const [type, settype] = useState('');
    const [low, setlow] = useState('');
    const [high, sethigh] = useState('');
    const [code, setcode] = useState('');
    const [status, setstatus] = useState(true);
    const [FIN, setFIN] = useState('');
    
    const addOrg = async () => {
        if (name === "" || account === "" || type === "" || low === "" || high === "" || code === "" || status === "" || FIN === "") {
            alert('Please fill all fields');
        } else {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.post('http://agentapp1.runasp.net/api/Organization', {
                    organizationName: name,
                    organizationStatus: status, // Assuming status is a string like "true" or "false"
                    licenseId: code,
                    organizationType: type,
                    organizationFinancialId: FIN,
                    financialLimitFrom: parseFloat(low),
                    financialLimitTo: parseFloat(high),
                    bankAccount: account
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });

                toast.success('Organization added successfully!');
                
                // Clear form inputs after successful submission
                setname('');
                setaccount('');
                settype('');
                setlow('');
                sethigh('');
                setcode('');
                setstatus('');
                setFIN('');
            } catch (error) {
                console.error('Error adding organization:', error);
                toast.error('Failed to add organization.');
            }
        }
    };

    return (
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3 className='text-color'>اضافة مؤسسة جديدة</h3>
            <div className='org-par'>
                <div>
                    <label>اسم المؤسسة</label>
                    <input type='text' value={name} onChange={e => setname(e.target.value)} />
                </div>
                <div>
                    <label>حساب البنك</label>
                    <input type='text' value={account} onChange={e => setaccount(e.target.value)} />
                </div>
                <div>
                    <label>نوع المؤسسة</label>
                    <input type='text' value={type} onChange={e => settype(e.target.value)} />
                </div>
                <div>
                    <label>الحد المالى الادنى</label>
                    <input type='number' value={low} onChange={e => setlow(e.target.value)} />
                </div>
                <div>
                    <label> حالة المؤسسة</label>
                    <input type='text' value={status} onChange={e => setstatus(e.target.value)} />
                </div>
                <div>
                    <label>الحد المالى الاقصى</label>
                    <input type='number' value={high} onChange={e => sethigh(e.target.value)} />
                </div>
                <div>
                    <label>كود الترخيص</label>
                    <input type='text' value={code} onChange={e => setcode(e.target.value)} />
                </div>
                <div>
                    <label>الكود المالى للمؤسسة</label>
                    <input type='text' value={FIN} onChange={e => setFIN(e.target.value)} />
                </div>
            </div>
            <button onClick={addOrg}>اضافة منظمة</button>
            <ToastContainer />
        </div>
    );
}

export default CreateOrg;
