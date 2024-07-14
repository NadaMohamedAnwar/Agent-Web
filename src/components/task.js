import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Task() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [agent, setAgent] = useState(null);
    const [client, setClient] = useState(null);
    const organization = (JSON.parse(sessionStorage.getItem('user'))).organizationId;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`https://agentapp1.runasp.net/api/Visit/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
                toast.error('Failed to fetch task.');
            }
        };

        fetchTask();
    }, [taskId]);

    useEffect(() => {
        const fetchAgentAndClient = async () => {
            if (task) {
                try {
                    const token = sessionStorage.getItem('token');

                    // Fetch agent
                    const agentResponse = await axios.get(`https://agentapp1.runasp.net/api/Organization/${organization}/Agents/${task.agentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setAgent(agentResponse.data);

                    // Fetch client
                    const clientResponse = await axios.get(`https://agentapp1.runasp.net/api/Client/${task.clientId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setClient(clientResponse.data);
                } catch (error) {
                    console.error('Error fetching agent or client:', error);
                    toast.error('Failed to fetch agent or client.');
                }
            }
        };

        fetchAgentAndClient();
    }, [task, organization]);

    if (!task || !agent || !client) {
        return <div>Loading...</div>;
    }

    return (
        <div className='col-md-10 task-par'>
            
            <div className='col-sm-12 col-md-6 col-lg-6 task-parameter'>
                <div>
                    <p>رقم الهوية</p>
                    <p>اسم النشاط</p>
                    <p>نوع النشاط</p>
                    <p>العميل</p>
                    <p>العامل</p>
                    <p>التاريخ والتوقيت المحدد</p>
                    <p>التاريخ والتوقيت الفعلى</p>
                    <p>الموقع الفعلى</p>
                </div>
                <div>
                    <p>{taskId}</p>
                    <p>{task.name}</p>
                    <p>زيارة</p>
                    <p>{client.accountName}</p>
                    <p>{agent.username}</p>
                    <p>{task.plannedTime}</p>
                    <p>{task.activityExecution ? task.activityExecution.activityActualTime : 'N/A'}</p>
                    <p>{task.activityExecution ? task.activityExecution.latitude : 'N/A'}</p>
                </div>
            </div>
           {task.activityExecution!=null &&(
             <div className='col-sm-12 col-md-6 col-lg-6 about-task'>
             {task.hasVoice && (
                 <div>
                     <h5>مذكرة صوتية</h5>
                     <audio controls>
                         <source src={`https://agentapp1.runasp.net${task.activityExecution.voicePath}`} type="audio/mp3" />
                     </audio>
                 </div>
             )}
             {task.hasImage && (
                 <div>
                     <h5>صور</h5>
                     <div className='task-img'>
                         <img src={`https://agentapp1.runasp.net${task.activityExecution.imagePath}`} alt="image" />
                     </div>
                 </div>
             )}
             <div>
                 <h5>ملاحظات</h5>
                 <p>كل شئ يبدو جيدا , فهم بحاجة فقط الى الاهتمام بالأشياء الهشة</p>
             </div>
         </div>
           )}
            <ToastContainer />
        </div>
    );
}

export default Task;
