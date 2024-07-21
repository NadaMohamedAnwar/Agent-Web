import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Checklists(){
    const x=useNavigate();
    const [checklists, setchecklists] = useState([]);
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    useEffect(() => {
        const fetchCheck = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Checklist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setchecklists(response.data);
            } catch (error) {
                console.error('Error fetching Checklists:', error);
                toast.error('Failed to fetch Checklists.');
            }
        };

        fetchCheck();
    }, []);
    const del_list = async (id) => {
        if (window.confirm('Are you sure you want to delete this checklist?')) {
            console.log("id is:",id)
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

                // Fetch all tasks related to the checklist
                const response = await axios.get('http://agentapp1.runasp.net/api/AgentActivities', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const allTasks = response.data.filter(t => t.checkListId == id);

                // Delete each task related to the checklist
                for (const task of allTasks) {
                    try {
                        await axios.delete(`http://agentapp1.runasp.net/api/AgentActivities/${task.id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } catch (error) {
                        console.error('Error deleting activity:', error);
                        toast.error('Failed to delete activity.');
                    }
                }

                // Delete the checklist itself
                try {
                    await axios.delete(`http://agentapp1.runasp.net/api/Organization/${organization}/Checklist/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    toast.success('Checklist deleted successfully!');
                    setchecklists(prevChecklists => prevChecklists.filter(c => c.id !== id));
                } catch (error) {
                    console.error('Error deleting checklist:', error);
                    toast.error('Failed to delete checklist.');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                toast.error('Failed to fetch tasks.');
            }
        }
    }
    return(
        
            <div className='col-sm-8 col-md-7 col-lg-5 orgdiv'>
                <div className='content-par'>
                    <h4 className='check-head text-color'>القوائم الحالية</h4>
                    <button className='add-btn' onClick={()=>x('add-checklist')}>اضافة قائمة<i className="fas fa-plus icon-action"></i></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>اسم القائمة</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {checklists.map((c)=>(
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>
                                    <i className="fas fa-edit icon-action" onClick={()=>x(`edit-checklist/${c.id}`)}></i>
                                    <i className="fas fa-trash icon-action" onClick={() => del_list(c.id)}></i>
                                </td>
                                
                            </tr>
                        ) )}
                    </tbody>
                </table>
                <ToastContainer />
            </div>
    )
   
}
export default Checklists;