import React, { useEffect, useState } from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function TaskDetails({ taskId }) {
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchPaddingVisits = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

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

        fetchPaddingVisits();
    }, [taskId]);

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
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
                <p>{task.clientId}</p>
                <p>{task.agentId}</p>
                <p>{task.plannedTime}</p>
                <p>{task.activityExecution.activityActualTime}</p>
                <p>{task.activityExecution.latitude}</p>
            </div>
        </div>
    );
}

export default TaskDetails;
