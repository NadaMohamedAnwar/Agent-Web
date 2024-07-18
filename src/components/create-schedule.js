import React from 'react';
import './style.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CreateSchedule(){
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Agents`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setagents(response.data);
                setAgent(response.data[0].id)
            } catch (error) {
                console.error('Error fetching agents:', error);
                toast.error('Failed to fetch Agents.');
            }
        };

        fetchAgents();
        const fetclients = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get('http://agentapp1.runasp.net/api/Client', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setclients(response.data.filter(c => c.organizationId == organization));
                setClient(response.data[0].id)
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Failed to fetch clients.');
            }
        };

        fetclients();
        const fetchCecklists = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Checklist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setchecklists(response.data);
                setchecklist(response.data[0].id)
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Failed to fetch clients.');
            }
        };

        fetchCecklists();
       
    }, []);
    const [name,setname]=useState('');
    const [date,setdate]=useState('');
    const [client, setClient] = useState();
    const [agent, setAgent] = useState();
    const [checklist, setchecklist] = useState();
    const [type, settype] = useState("visit");
    const [agents,setagents]=useState([]);
    const [clients,setclients]=useState([]);
    const [checklists,setchecklists]=useState([]);
    const addschedule=async ()=>{

        if(type==="visit"){
            if(name==="" || client==="" || agent==="" || date===""){
                alert('Please fill all fields');
             }else{
                console.log(name,organization,client,agent,date)
                try {
                    const token = sessionStorage.getItem('token'); // Retrieve token from localStorage
    
                    const response = await axios.post('http://agentapp1.runasp.net/api/Visit', {
                        name:name,
                        organizationId:organization,
                        clientId:client,
                        agentId:agent,
                        plannedTime:date,
                        hasImage:true,
                        hasVoice:true
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Include token in Authorization header
                        }
                    });
                    setname('');
                    setdate('');
                    toast.success('Visit added successfully!');
                    
                } catch (error) {
                    console.error('Error', error);
                    toast.error('Failed to add Visit.');
                }
    
            }

        }else{
            if(name==="" || client==="" || agent==="" || date==="" || checklist===""){
                toast.error('Please fill all fields');
             }else{
                try {
                    const token = sessionStorage.getItem('token'); // Retrieve token from localStorage
    
                    const response = await axios.post('http://agentapp1.runasp.net/api/AgentActivities', {
                        name:name,
                        organizationId:organization,
                        clientId:client,
                        agentId:agent,
                        plannedTime:date,
                        checkListId:checklist
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Include token in Authorization header
                        }
                    });
                    setname('');
                    setdate('');
                    toast.success('Activity added successfully!');
                    
                } catch (error) {
                    console.error('Error', error);
                    toast.error('Failed to add Activity.');
                }
    
    
             }
        }
        
    }
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
        <h3 className='text-color'>اضافة مهمة </h3>
        <div className='org-par'>
            <div>
                <label>اسم المهمة</label>
                <input className='border-outline' type='text' value={name} onChange={e => setname(e.target.value)}/>
            </div>
            <div>
                <label>التاريخ</label>
                <input className='border-outline' type='datetime-local' value={date} onChange={e => setdate(e.target.value)}/>
            </div>
            <div>
                <label>نوع النشاط</label>
                <select onChange={e => settype(e.target.value)}>
                    <option value={"visit"}>زيارة</option>
                    <option value={"checklist"}>قائمة</option>
                </select>
            </div>
           
            <div>
                    <label>العميل</label>
                    <select onChange={e => setClient(e.target.value)}>
                        {clients.map((c, index) => (
                            <option key={index} value={c.id}>
                                {c.accountName}
                            </option>
                        ))}
                    </select>
                </div>
            <div>
                <label>العامل</label>
                <select onChange={e => setAgent(e.target.value)}>
                    {agents.map((a, index) => (
                        <option key={index} value={a.id}>
                            {a.username}
                        </option>
                    ))}
                </select>
            </div>
            {type=== "checklist" &&(
                <div>
                <label>القوائم</label>
                <select onChange={e => setchecklist(e.target.value)}>
                    {checklists.map((c, index) => (
                        <option key={index} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            )}
           
        </div>
        <button onClick={addschedule}>اضافة مهمة</button>
        <ToastContainer />
    </div>
    )
}
export default  CreateSchedule;
    ;