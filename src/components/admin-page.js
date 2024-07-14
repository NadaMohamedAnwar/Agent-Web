import React from 'react';
import './style.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function AdminPage(){
    const [orgs, setOrgs] = useState([]);
    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get('http://agentapp1.runasp.net/api/Organization', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrgs(response.data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
                toast.error('Failed to fetch organizations.');
            }
        };

        fetchOrgs();
    }, []);
    return(
        
            <div className='col-sm-12 col-md-11 col-lg-10 orgdiv'>
                <h4 className='orghead text-color'>المؤساسات الحالية</h4>
                <table>
                    <thead>
                        <tr>
                            <th>اسم المؤسسة</th>
                            <th>الحد المالى الادنى</th>
                            <th>الحد المالى الاقصى</th>
                            <th>نوع المؤسسة</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orgs.map((o)=>(
                            <tr key={o.id}>
                                <td>{o.organizationName}</td>
                                <td>{o.financialLimitFrom}</td>
                                <td>{o.financialLimitTo}</td>
                                <td>{o.organizationType}</td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>
    )
}
export default AdminPage;