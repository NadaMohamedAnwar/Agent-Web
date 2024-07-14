import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import PaddingTasks from './padding-tasks';
import FinshTasks from './finsh-tasks';
import PaddingChecks from './padding-checks';
import FinshChecks from './finish-checks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Tasks() {
    const s = {
        backgroundColor: "rgb(221, 245, 221)",
        borderBottom: "1px solid green"
    };
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    const [type, setType] = useState(0);
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
                setclients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Failed to fetch clients.');
            }
        };

        fetclients();
        const fetchPaddingVisits = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get(`http://agentapp1.runasp.net/api/Visit/GetorganizationVisits/${organization}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const allTasks = response.data;
                const padding = allTasks.filter(task => task.activityExecution === null);
                const finish = allTasks.filter(task => task.activityExecution !== null);

                setPaddingTasks(padding);
                setnewPaddingTasks(padding);
                setFinishTasks(finish);
                setnewFinishTasks(finish);

            } catch (error) {
                console.error('Error fetching visits:', error);
                toast.error('Failed to fetch visits.');
            }
        };

        fetchPaddingVisits();
            const fetchPaddingchecks = async () => {
                try {
                    const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
            
                    const response = await axios.get('http://agentapp1.runasp.net/api/AgentActivities', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
            
                    const allTasks = response.data;
            
                    const paddingcheck = [];
                    const finishcheck = [];
            
                    const fetchSubmissionStatus = async (taskId) => {
                        try {
                            const submissionResponse = await axios.get(`http://agentapp1.runasp.net/api/AgentActivities/${taskId}/Submission`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            return submissionResponse.data; 
                        } catch (error) {
                            return null;
                        }
                    };
            
                    const paddingcheckPromises = allTasks.map(async (task) => {
                        const submissionStatus = await fetchSubmissionStatus(task.id);
                        if (submissionStatus === null) {
                            paddingcheck.push(task);
                        } else {
                            finishcheck.push(task);
                        }
                    });
            
                    await Promise.all(paddingcheckPromises);
            
                    setPaddingChecklists(paddingcheck);
                    setnewPaddingChecklists(paddingcheck);
                    setFinishChecklists(finishcheck);
                    setnewFinishChecklists(finishcheck);
                } catch (error) {
                    console.error('Error fetching clients:', error);
                    toast.error('Failed to fetch clients.');
                }
            };
            

        fetchPaddingchecks();
    }, [organization]);
    const [paddingTasks, setPaddingTasks] = useState([]);
    const [newpaddingTasks, setnewPaddingTasks] = useState([])
    const [finishTasks, setFinishTasks] = useState([]);
    const [newfinishTasks, setnewFinishTasks] = useState([])
    const [paddingChecklists, setPaddingChecklists] = useState([]);
    const [newpaddingChecklists, setnewPaddingChecklists] = useState([])
    const [finishChecklists, setFinishChecklists] = useState([]);
    const [newfinishChecklists, setnewFinishChecklists] = useState([])
    // ======================================================================================================================
    const [agents,setagents]=useState([]);
    const [clients,setclients]=useState([]);
    const [client, setClient] = useState(-1);
    const [agent, setAgent] = useState(-1);
    const [taskName, settaskName] = useState("");
    const [activeTaskType, setActiveTaskType] = useState('padding');
    useEffect(()=>{

        let filteredTasks=paddingTasks;
        if ((client != -1 ) && (agent != -1)) {
            filteredTasks = paddingTasks.filter((t) => {
            return t.agentId == agent && t.clientId == client});

        } else if ((client == -1) && (agent != -1)) {
           filteredTasks = paddingTasks.filter((t) =>{
            return t.agentId == agent});
        } else if ((client != -1)  && (agent == -1)) {
          filteredTasks = paddingTasks.filter((t) =>{ 
            return t.clientId == client});
        }
        setnewPaddingTasks(filteredTasks);
        
    },[agent,client,paddingTasks,type]);
    useEffect(()=>{
        let filteredTasks=finishTasks;
        if ((client != -1 ) && (agent != -1)) {
            filteredTasks = finishTasks.filter((t) => {
            return t.agentId == agent && t.clientId == client});

        } else if ((client == -1) && (agent != -1)) {
           filteredTasks = finishTasks.filter((t) =>{
            return t.agentId == agent});
        } else if ((client != -1)  && (agent == -1)) {
          filteredTasks = finishTasks.filter((t) =>{ 
            return t.clientId == client});
        }
        setnewFinishTasks(filteredTasks);
    },[agent,client,finishTasks,type]);

    const taskSearch=()=>{
        let filteredTasks;
        if(activeTaskType === "finish" && type == 0){
            filteredTasks = finishTasks.filter(t =>t.name.includes(taskName));
            setnewFinishTasks(filteredTasks);
        }else if(activeTaskType === "padding" && type == 0){
            filteredTasks = paddingTasks.filter(t =>t.name.includes(taskName));
            setnewPaddingTasks(filteredTasks);
        }else if(activeTaskType === "finish" && type == 1){
            filteredTasks = finishChecklists.filter(t =>t.name.includes(taskName));
            setnewFinishChecklists(filteredTasks);
        }else if(activeTaskType === "padding" && type == 1){
            filteredTasks = paddingChecklists.filter(t =>t.name.includes(taskName));
            setnewPaddingChecklists(filteredTasks);
        }
    }
    // ==========================================================================================================
    useEffect(()=>{

        let filteredTasks=paddingChecklists;
        if ((client != -1 ) && (agent != -1)) {
            filteredTasks = paddingChecklists.filter((t) => {
            return t.agentId == agent && t.clientId == client});

        } else if ((client == -1) && (agent != -1)) {
           filteredTasks = paddingChecklists.filter((t) =>{
            return t.agentId == agent});
        } else if ((client != -1)  && (agent == -1)) {
          filteredTasks = paddingChecklists.filter((t) =>{ 
            return t.clientId == client});
        }
        setnewPaddingChecklists(filteredTasks);
        
    },[agent,client,paddingChecklists,type]);
    useEffect(()=>{
        let filteredTasks=finishChecklists;
        if ((client != -1 ) && (agent != -1)) {
            filteredTasks = finishChecklists.filter((t) => {
            return t.agentId == agent && t.clientId == client});

        } else if ((client == -1) && (agent != -1)) {
           filteredTasks = finishChecklists.filter((t) =>{
            return t.agentId == agent});
        } else if ((client != -1)  && (agent == -1)) {
          filteredTasks = finishChecklists.filter((t) =>{ 
            return t.clientId == client});
        }
        setnewFinishChecklists(filteredTasks);
    },[agent,client,finishChecklists,type]);
    // ===========================================================================================================
    return (
        <div className='parent-container'>
            <div className='col-sm-12 col-md-11 col-lg-10 search-on-tasks'>
                <div className="col-sm-12 col-md-5 col-lg-2 search-icon">
                    <i className="fas fa-search"></i>
                    <input type='search' placeholder='اسم المهمة' value={taskName} onChange={e => settaskName(e.target.value)}></input>
                </div>
                <button className='col-sm-12 col-md-1 col-lg-1' onClick={taskSearch}>بحث</button>
                <label>نوع النشاط</label>
                <select className='col-sm-12 col-md-6 col-lg-2 border-outline' onChange={e => setType(e.target.value)}>
                    <option value={0}>زيارة </option>
                    <option value={1}>قائمة </option>     
                </select>
                <label>العامل </label>
                <select className='col-sm-12 col-md-6 col-lg-2 border-outline' onChange={e => setAgent(e.target.value)}>
                    <option value={-1}>الكل </option>
                    {agents.map((a, index) => (
                        <option key={index} value={a.id}>
                            {a.username}
                        </option>
                    ))}
                </select>
                <label>العميل </label>
                <select className='col-sm-12 col-md-6 col-lg-2 border-outline' onChange={e => setClient(e.target.value)}>
                    <option value={-1}>الكل </option>
                    {clients.map((c, index) => (
                        <option key={index} value={c.id}>
                            {c.accountName}
                        </option>
                    ))}
                </select>
            </div>
            <div className='tasks-par'>
                <div className='tasks-actions'>
                    <button id='ptask' className={`col-sm-6 ${activeTaskType === 'padding' ? 'active' : ''}`}  style={activeTaskType === 'padding' ? s : {}}  onClick={() => setActiveTaskType('padding')}>المهام القادمة</button>
                    <button id='ftask' className={`col-sm-6 ${activeTaskType === 'finish' ? 'active' : ''}`} style={activeTaskType === 'finish' ? s : {}} onClick={() => setActiveTaskType('finish')}>المهام المنتهية</button>
                </div>
                <div className='tasks-content'>
                    {activeTaskType === 'padding' ?
                        type == 0 ?
                        <PaddingTasks tasks={newpaddingTasks} />:
                        <PaddingChecks tasks={newpaddingChecklists} />:
                        type == 0 ?
                        <FinshTasks tasks={newfinishTasks} />:
                        <FinshChecks tasks={newfinishChecklists} />
                        
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}


export default Tasks;
