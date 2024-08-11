import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Task() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    // const [agent, setAgent] = useState(null);
    // const [client, setClient] = useState(null);
    const organization = (JSON.parse(sessionStorage.getItem('user'))).organizationId;
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://agentapp1.runasp.net/api/Visit/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTask(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching task:', error);
                toast.error('Failed to fetch task.');
            }
        };

        fetchTask();
    }, [taskId]);

    // useEffect(() => {
    //     const fetchAgentAndClient = async () => {
    //         if (task) {
    //             try {
    //                 const token = sessionStorage.getItem('token');

    //                 // Fetch agent
    //                 const agentResponse = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Agents/${task.agentId}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 });
    //                 setAgent(agentResponse.data);

    //                 // Fetch client
    //                 const clientResponse = await axios.get(`http://agentapp1.runasp.net/api/Client/${task.clientId}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 });
    //                 setClient(clientResponse.data);
    //             } catch (error) {
    //                 console.error('Error fetching agent or client:', error);
    //                 toast.error('Failed to fetch agent or client.');
    //             }
    //         }
    //     };

    //     fetchAgentAndClient();
    // }, [task, organization]);

    if (!task) {
        return <div>Loading...</div>;
    }
    const getLocationName = async (lat, lng) => {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
              format: 'json',
              lat,
              lon: lng,
            }
          });
          return response.data.display_name || 'Unknown Location';
        } catch (error) {
          console.error('Error fetching location name:', error);
          return 'Unknown Location';
        }
      };
    return (
        <div className='col-md-10 task-par'>
            <div className='col-md-10'>
                <h2>بيانات المهمة</h2>
            </div> 
            <div className='col-sm-12 col-md-6 col-lg-6 task-parameter'>
                <div>
                    <p>اسم المهمة</p>
                    <p>نوع النشاط</p>
                    <p>العميل</p>
                    <p>العامل</p>
                    <p>التاريخ والتوقيت المحدد</p>
                    <p>التاريخ والتوقيت الفعلى</p>
                    <p>(km)فرق المسافة</p>
                    {/* <p>الموقع الفعلى</p> */}
                </div>
                <div>
                    <p>{task.name}</p>
                    <p>زيارة</p>
                    <p>{task.client.accountName}</p>
                    <p>{task.agent.username}</p>
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
                         <source src={`http://agentapp1.runasp.net${task.activityExecution.voicePath}`} type="audio/mp3" />
                     </audio>
                 </div>
             )}
             {task.hasImage && (
                 <div>
                     <h5>صور</h5>
                     <div className='task-img'>
                         <img src={`http://agentapp1.runasp.net${task.activityExecution.imagePath}`} alt="image" />
                     </div>
                 </div>
             )}
             <div>
                 <h5>ملاحظات</h5>
                 <p>{task.activityExecution.note}</p>
             </div>
         </div>
           )}
            <ToastContainer />
        </div>
    );
}

export default Task;
