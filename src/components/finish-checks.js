
import React from 'react';
import './style.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function FinshChecks({tasks}){
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    const x=useNavigate();
    const id='id';
    console.log("tasks",tasks)
    const [agents, setAgents] = useState([]);
    const [clients, setclients] = useState([]);
    const [checks, setchecks] = useState([]);
    useEffect(() => {
        const fetchAgentsForTasks = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const agentPromises = tasks.map(t =>
                    axios.get(`https://agentapp1.runasp.net/api/Organization/${organization}/Agents/${t.agentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                );

                const agentResponses = await Promise.all(agentPromises);
                const agentsData = agentResponses.map(response => response.data);
                setAgents(agentsData);
            } catch (error) {
                console.error('Error fetching agents:', error);
                toast.error('Failed to fetch Agents.');
            }
        };
        fetchAgentsForTasks();
        const fetchclientsForTasks = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const clientPromises = tasks.map(t =>
                    axios.get(`https://agentapp1.runasp.net/api/Client/${t.clientId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                );

                const clientResponses = await Promise.all(clientPromises);
                const clientData = clientResponses.map(response => response.data);
                setclients(clientData);
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Failed to fetch clients.');
            }
        };
        fetchclientsForTasks();
        const fetchcheck = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const checkPromises = tasks.map(t =>
                    axios.get(`https://agentapp1.runasp.net/api/AgentActivities/${t.id}/Submission`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                );

                const checkResponses = await Promise.all(checkPromises);
                const checkData = checkResponses.map(response => response.data);
                setchecks(checkData);
            } catch (error) {
                console.error('Error fetching actual date:', error);
                toast.error('Failed to fetch actual date.');
            }
        };
        fetchcheck();
        
    },[tasks]);
    const getAgentName = (agentId) => {
        const agent = agents.find(a => a.id === agentId);
        return agent ? agent.username : 'Loading...';
    };
    const getclientName = (clientId) => {
        const client = clients.find(a => a.id === clientId);
        return client ? client.accountName : 'Loading...';
    };
    const getactualTime = (checkId) => {
        const check = checks.find(a => a.activityAgentId === checkId);
        return check ? check.submissionDate : 'Loading...';
    };
    if (!tasks || tasks.length === 0) {
        return <div>No tasks available.</div>;
    }
    return(
        <div>
           <table>
                <thead>
                    <tr>
                        <th> اسم المهمة</th>
                        <th> نوع النشاط</th>
                        <th>التاريخ والتوقيت المحدد</th>
                        <th>التاريخ والتوقيت الفعلى</th>
                        <th> العميل</th>
                        <th> العامل</th>

                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t)=>(
                        <tr key={t.id} onClick={()=>x(`check/${t.id}/finish`)}>
                            <td>{t.name}</td>
                            <td>قائمة</td>
                            <td>{t.plannedTime}</td>
                            <td>{getactualTime(t.id)}</td>
                            <td>{getclientName(t.clientId)}</td>
                            <td>{getAgentName(t.agentId)}</td>
                        </tr>
                    ) )}
                </tbody>
            </table>
         <ToastContainer/>
        </div>
    )
}
export default FinshChecks;