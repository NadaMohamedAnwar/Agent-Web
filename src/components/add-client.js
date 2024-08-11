import React, { useState, useEffect } from 'react';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MapModal from './map-model';

function AddClient() {
    const [name, setname] = useState('');
    const [contactname, setcontactname] = useState('');
    const [accountAderss, setaccountAderss] = useState('');
    const [num, setnum] = useState('');
    const [contactAddress, setcontactAddress] = useState('');
    const [customerType, setcustomerType] = useState(0);
    const [category, setcategory] = useState();
    const [categories, setcategories] = useState([]);
    const [latLng, setLatLng] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);
    

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
                setcategory(response.data[0]?.id);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories.');
            }
        };

        fetcategories();
    }, []);

    useEffect(() => {
        if (latLng) { // Check if latLng is not null
            const fetchLocationName = async () => {
                const locationName = await getLocationName(latLng.lat, latLng.lng);
                setaccountAderss(locationName);
            };
            fetchLocationName();
        }
    }, [latLng]);

    const addclient = async () => {
        if (name === "" || category === "" || accountAderss === "" || num === "" || contactAddress === "") {
            toast.error('Please fill all fields');
        } else {
            try {
                const token = sessionStorage.getItem('token');

                const response = await axios.post('http://agentapp1.runasp.net/api/Client', {
                    accountAddress: accountAderss, 
                    accountName: name,
                    contactMobileNumber: num,
                    customerType: customerType,
                    contactAddress: contactAddress,
                    categoryId: category,
                    contactName: contactname,
                    organizationId: (JSON.parse(sessionStorage.getItem('user'))).organizationId,
                    Latitude: latLng?.lat, // Using optional chaining to avoid errors
                    longitude: latLng?.lng // Using optional chaining to avoid errors
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in Authorization header
                    }
                });
                setname('');
                setaccountAderss('');
                setnum('');
                setcontactAddress('');
                setcategory(null);
                setcontactname('');
                setLatLng(null)
                toast.success('Client added successfully!');
            } catch (error) {
                console.error('Error', error);
                toast.error('Failed to add client.');
            }
        }
    };
    const handleConfirmLocation = (latlng) => {
        setLatLng(latlng);
        console.log('Location confirmed:', latlng);
    }
    return (
        <div className='col-sm-12 col-md-8 col-lg-4 t-parant'>
            <h3 className='text-color'>اضافة عميل </h3>
            <div className='org-par'>
                <div>
                    <label>اسم الحساب</label>
                    <input className='border-outline' type='text' value={name} onChange={e => setname(e.target.value)} />
                </div>
                <div>
                    <label>اسم التواصل</label>
                    <input className='border-outline' type='text' value={contactname} onChange={e => setcontactname(e.target.value)} />
                </div>
                <div>
                    <label>رقم الهاتف</label>
                    <input className='border-outline' type='number' value={num} onChange={e => setnum(e.target.value)} />
                </div>
                <div>
                    <label>عنوان التواصل</label>
                    <input className='border-outline' type='text' value={contactAddress} onChange={e => setcontactAddress(e.target.value)} />
                </div>
                <div>
                    <label>الفئة</label>
                    <select value={category} onChange={e => setcategory(e.target.value)}>
                        {categories.map((c, index) => (
                            <option key={index} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>نوع العميل</label>
                    <select value={customerType} onChange={e => setcustomerType(e.target.value)}>
                        <option value={0}>business</option>
                        <option value={1}>Consumer</option>
                        <option value={2}>Merchant</option>
                    </select>
                </div>
            </div>
            <button onClick={() => setShowMapModal(true)}>تحديد الموقع</button>
            <button onClick={addclient}>اضافة</button>
            <ToastContainer />
            <MapModal show={showMapModal}  handleClose={() => setShowMapModal(false)}
          onConfirm={handleConfirmLocation} />
        </div>
    );
}

export default AddClient;
