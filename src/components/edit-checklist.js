import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function EditChecklist(){
    const navigate=useNavigate();
    const { listId } = useParams();
    const [questions,setquestions]=useState([]);
    const [status,setstatus]=useState(true);
    const [choseCategories,setchoseCategories]=useState([])
    const organization=(JSON.parse(sessionStorage.getItem('user'))).organizationId;
    useEffect(() => {
        const fetcategories = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get('http://agentapp1.runasp.net/api/Category', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setcategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };
        const fetchlist = async () => {
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Checklist/${listId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setname(response.data.name)
                setquestions(response.data.questions)
                setstatus(response.data.checkList_Status)
                setchoseCategories(response.data.categoriesIds)
            } catch (error) {
                console.error('Error fetching Checklists:', error);
                toast.error('Failed to fetch Checklists.');
            }
        };

        fetchlist();
        fetcategories();
    }, []);
    const [name,setname]=useState('');
    const [categories,setcategories]=useState([]);
    const [question,setquestion]=useState({
        id:null,
        text:"",
        note:"",
        available_image:false,
        available_Voice:false
    });
    
    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setchoseCategories(selectedOptions);
      };
      const addQuestion = () => {
       
        setquestions([...questions, question]);
        setquestion({
            id: null,
            text: "",
            note: "",
            available_image: false,
            available_Voice: false
        });
    
        toast.success('Question added successfully!');
    };
    
    const updateList=async ()=>{
         if(name==="" || choseCategories.length === 0 || questions.length===0){
            toast.error('Please fill all fields');
         }else{
            console.log(questions,choseCategories,status,name)
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.put(`http://agentapp1.runasp.net/api/Organization/${organization}/Checklist/${listId}`, {
                    name:name,
                    categoriesIds:choseCategories,
                    checkList_Status:status,
                    questions:questions,

                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                setname('');
                setchoseCategories([]);
                setquestions([]);
                toast.success('Checklist updated successfully!');
                setTimeout(() => {
                    navigate(-1);
                }, 3000);

            } catch (error) {
                console.error('Error', error);
                toast.error('Failed to update checklist.');
            }

         }
    }
    const delQuestion = (id) => {
        setquestions(questions.filter(q => q.id !== id)); 
        toast.success('Question deleted successfully!');
    };
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3 className='text-color'>تعديل قائمة </h3>
            <div className='org-par'>
                <div>
                    <label>اسم القائمة</label>
                    <input className='border-outline' type='text' value={name} onChange={e => setname(e.target.value)}/>
                </div>
                <div>
                    <label>الحالة</label>
                    <select value={status} onChange={e => setstatus(e.target.value)}>
                        <option value={true}>نشط</option>
                        <option value={false}>غير نشط</option>
                    </select>
                </div>
                <div>
                    <label>الفئة</label>
                    <select className='border-outline'  multiple value={choseCategories} onChange={handleCategoryChange}>
                    {categories.map((c, index) => (
                        <option key={index} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                    </select>
                </div>
                <div id='questionDiv'>
                    <label>اضافة سؤال</label>
                    <input className='border-outline' type='text' value={question.text} onChange={e => setquestion({...question , text : e.target.value})} placeholder='السؤال'/>
                    <input className='border-outline' type='text' value={question.note} onChange={e => setquestion({...question , note : e.target.value})} placeholder='ملاحظة'/>
                    <input
                    type='checkbox'
                    checked={question.available_image}
                    onChange={e => setquestion({ ...question, available_image: e.target.checked })}
                    />
                    <label>صورة</label>
                    <input
                    type='checkbox'
                    checked={question.available_Voice}
                    onChange={e => setquestion({ ...question, available_Voice: e.target.checked })}
                    />
                    <label>صوت</label>
                    <button onClick={addQuestion}>اضافة</button>
                    <table>
                        <thead>
                            <tr>
                                <th>الاسئلة التى تمت اضافتها</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q, index) => (
                                <tr key={index}>
                                    <td>
                                        {q.text}
                                        <i className="fas fa-trash icon-action" onClick={() => delQuestion(q.id)}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={updateList}>تعديل قائمة</button>
            <button onClick={() => navigate(-1)}>الغاء</button>
            <ToastContainer />
        </div>
    )
}
export default EditChecklist;