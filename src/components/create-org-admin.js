import React from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState ,useEffect} from 'react';
import axios from 'axios';
function CreateOrgAdmin(){
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [ssn,setssn]=useState('');
    const [num,setnum]=useState('');
    const [email,setemail]=useState('');
    const [bussnisId,setbussnisId]=useState('');
    const [status,setstatus]=useState(true);
    const [orgs, setOrgs] = useState([]);
    const [organization,setorganization]=useState();
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
                setorganization(response.data[0].id)
            } catch (error) {
                console.error('Error fetching organizations:', error);
                toast.error('Failed to fetch organizations.');
            }
        };

        fetchOrgs();
    }, []);
    const addOrg=async ()=>{
         if(username==="" ||password==="" || ssn==="" || num==="" ||email==="" || bussnisId===""){
            alert('Please fill all fields');
         }else{
            try {
                const token = sessionStorage.getItem('token'); // Retrieve token from localStorage

                const response = await axios.post(`http://agentapp1.runasp.net/api/Organization/${organization}/OrgAdmin`, {
                    userStatus: status,
                    businessUserId: bussnisId, // Assuming status is a string like "true" or "false"
                    username: username,
                    userPassword: password,
                    userMobileNumber: parseFloat(num),
                    userNationalId: parseFloat(ssn),
                    userEmail: email
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });

                toast.success('Organization Admin added successfully!');
                setusername('');
                setpassword('');
                setssn('');
                setnum('');
                setbussnisId('');
                setemail('');
                
            } catch (error) {
                console.error('Error', error);
                toast.error('Failed to add organization admin.');
            }
        }
    }
    return(
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3>اضافة مشرف مؤسسة </h3>
            <div className='org-par'>
                <div>
                    <label>اسم المستخدم</label>
                    <input type='text' value={username} onChange={e => setusername(e.target.value)}/>
                </div>
                <div>
                    <label>كلمة مرور المستخدم</label>
                    <input type='password' value={password} onChange={e => setpassword(e.target.value)}/>
                </div>
                <div>
                    <label>رقم الهاتف</label>
                    <input type='number' value={num} onChange={e => setnum(e.target.value)}/>
                </div>
                <div>
                    <label>الرقم القومى</label>
                    <input type='text' value={ssn} onChange={e => setssn(e.target.value)}/>
                </div>
                <div>
                    <label>البريد الالكترونى للمستخدم</label>
                    <input type='email' value={email} onChange={e => setemail(e.target.value)}/>
                </div>
                <div>
                    <label>كود مستخدم الاعمال</label>
                    <input type='number' value={bussnisId} onChange={e => setbussnisId(e.target.value)}/>
                </div>
                <div>
                    <label>الحالة</label>
                    <select value={status} onChange={e => setstatus(e.target.value)}>
                        <option value={true}>نشط</option>
                        <option value={false}>غير نشط</option>
                    </select>
                </div>
                <div>
                    <label>الهيئة</label>
                    <select className='border-outline'  value={organization} onChange={e => setorganization(e.target.value)}>
                    {orgs.map((o, index) => (
                        <option key={index} value={o.id}>
                            {o.organizationName}
                        </option>
                    ))}
                    </select>
                </div>
            </div>
            <button onClick={addOrg}>اضافة</button>
            <ToastContainer />
        </div>
    )
}
export default  CreateOrgAdmin;
    ;