import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Check() {
    const { checkId ,type} = useParams();
    const [task, setTask] = useState(null);
    const [agent, setAgent] = useState(null);
    const [client, setClient] = useState(null);
    const [sub, setsub] = useState(null);
    const[checklist,setchecklist]=useState();
    const organization = (JSON.parse(sessionStorage.getItem('user'))).organizationId;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`https://agentapp1.runasp.net/api/AgentActivities/${checkId}`, {
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
    }, [checkId]);
    const fetchSubmissionStatus = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const submissionResponse = await axios.get(`https://agentapp1.runasp.net/api/AgentActivities/${checkId}/Submission`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
             setsub(submissionResponse.data) // Assuming this returns the submission status
        } catch (error) {
            console.error('error', error);
            return null;
        }
    };
    if(type === "finish"){
        fetchSubmissionStatus();
    }
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
                    const checklistResponse = await axios.get(`https://agentapp1.runasp.net/api/Organization/${organization}/Checklist/${task.checkListId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setchecklist(checklistResponse.data)
                } catch (error) {
                    console.error('Error fetching agent or client or checklist:', error);
                    toast.error('Failed to fetch agent or client or checklist.');
                }
            }
        };

        fetchAgentAndClient();
    }, [task, organization]);

    if (!task || !agent || !client) {
        return <div>Loading...</div>;
    }
    const getquestion = (qID) => {
        if (!checklist) {
            return 'Loading...';
        }
        const q = checklist.questions.find(a => a.id === qID);
        return q ? q.text : 'Question not found';
    };
    return (
        <div className='col-md-10 task-par'>
            
            <div className='col-sm-12 col-md-6 col-lg-6 task-parameter'>
                <div>
                    <p>اسم النشاط</p>
                    <p>نوع النشاط</p>
                    <p>العميل</p>
                    <p>العامل</p>
                    <p>التاريخ والتوقيت المحدد</p>
                    <p>التاريخ والتوقيت الفعلى</p>
                </div>
                <div>
                    <p>{task.name}</p>
                    <p>قائمة</p>
                    <p>{client.accountName}</p>
                    <p>{agent.username}</p>
                    <p>{task.plannedTime}</p>
                    <p>{type==="finish" ? sub.submissionDate : 'N/A'}</p>
                </div>
            </div>
           {type ==='finish' &&(
             <div className='col-sm-12 col-md-6 col-lg-6 about-task'>
               {sub.answers.map((t)=>(
                   <div  className='check-content'>
                    <div>
                        <h5>السؤال</h5>
                        <p>{getquestion(t.questionId)}</p>
                    </div>
                    <div>
                        <h5>ملاحظات</h5>
                        <p>{t.note}</p>
                    </div>
                    {t.hasVoice && (
                        <div>
                            <h5>مذكرة صوتية</h5>
                            <audio controls>
                                <source src={`http://agentapp1.runasp.net${t.voicepath}`} type="audio/mp3" />
                            </audio>
                        </div>
                    )}
                    {t.hasImage && (
                        <div>
                            <h5>صور</h5>
                            <div className='task-img'>
                                <img src={`http://agentapp1.runasp.net${t.imagepath}`} alt="image" />
                            </div>
                        </div>
                    )}
                    </div>
                                
                    ) )}
                    
         </div>
           )}
            <ToastContainer />
        </div>
    );
}

export default  Check;
