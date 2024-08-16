import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure to import the CSS for react-toastify
import axios from 'axios';
import L from 'leaflet'; // Import Leaflet

// Create a custom HTML icon using FontAwesome
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.mapmarker.io/api/v1/pin?text=V&size=50&hoffset=1&color=00FF00&background=00FF00', // Green color
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const AgentsMarker = ({ agent }) => {
  // Ensure the latitude and longitude are valid numbers before rendering the marker
  console.log(agent.username)
  if (agent.last_Latitude && agent.last_Longitude) {
    return (
      <Marker position={[agent.last_Latitude, agent.last_Longitude]} icon={customIcon}>
        <Popup>
          <div className='map-info'>
            <h4>Agent</h4>
            <p><i className="fa-solid fa-user"></i>  {agent.username}</p>
            <p><i className="fa-solid fa-calendar"></i>  {agent.lastSeen}</p>
            <p><i className="fa-solid fa-location-dot"></i>  {agent.locationName}</p>
          </div>
        </Popup>
      </Marker>
    );
  }
  return null; // Return null if coordinates are not valid
};
const AgentLocationMarker = ({ agent }) => {
  // Ensure the latitude and longitude are valid numbers before rendering the marker
  console.log(agent.agent.username)
  if (agent.latitude && agent.longitude) {
    return (
      <Marker position={[agent.latitude, agent.longitude]} icon={greenIcon}>
        <Popup>
          <div className='map-info'>
            <h4>Agent</h4>
            <p><i className="fa-solid fa-user"></i>  {agent.agent.username}</p>
            <p><i className="fa-solid fa-calendar"></i>  {agent.timestamp}</p>
            <p><i className="fa-solid fa-location-dot"></i>  {agent.locationName}</p>
          </div>
        </Popup>
      </Marker>
    );
  }
  return null; // Return null if coordinates are not valid
};

const AgentsMap2 = () => {
  const organization = (JSON.parse(sessionStorage.getItem('user'))).organizationId;
  
  // Get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  };

  const [agents, setAgents] = useState([]);
  const [agentsLocation, setagentsLocation] = useState([]);
  const [agent, setAgent] = useState(-1);
  const [agentNum,setagentNum]=useState(0);
  const [tasksNum,settasksNum]=useState(0);
  const [visitNum,setvisitNum]=useState(0);
  const [date, setdate] = useState(); 

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

        const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Agents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setdate(getCurrentDate())
        let agentsWithLocations = await Promise.all(response.data.map(async (agent) => {
          const locationName = await getLocationName(agent.last_Latitude, agent.last_Longitude);
          return { ...agent, locationName };
        }));
        setAgents(agentsWithLocations);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to fetch Agents.');
      }
    };

    fetchAgents();
  }, []);

  const fetchTask = async () => {
    if (agent == -1) {
      try {
        const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

        const response = await axios.get(`http://agentapp1.runasp.net/api/Organization/${organization}/Agents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let agentsWithLocations = await Promise.all(response.data.map(async (agent) => {
          const locationName = await getLocationName(agent.last_Latitude, agent.last_Longitude);
          return { ...agent, locationName };
        }));
        setAgents(agentsWithLocations);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to fetch Agents.');
      }

    } else {
      try {
        const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

        const response = await axios.get(`http://agentapp1.runasp.net/api/Agent/${agent}/Location/${date}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let agentsWithLocations = await Promise.all(response.data.map(async (agent) => {
          const locationName = await getLocationName(agent.latitude, agent.longitude);
          return { ...agent, locationName };
        }));
        setagentsLocation(agentsWithLocations);
        console.log(agentsWithLocations)
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to fetch Agents.');
      }
    }

  };

  const getLocationName = async (lat, lng) => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates:', { lat, lng });
      return 'Unknown Location';
    }
  
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
    <div className='map-parent'>
      <div className='col-sm-12 col-md-4 col-lg-4 map-details'>
        <div className='map-filter'>
          <h2>تصفية</h2>
          <div className='line'></div>
          <div className='col-sm-10 col-md-10 col-lg-10'>
            <select className='col-sm-12 col-md-5 col-lg-5' onChange={e => setAgent(e.target.value)}>
              <option value={-1}>الكل </option>
              {agents.map((a, index) => (
                <option key={index} value={a.id}>
                  {a.username}
                </option>
              ))}
            </select>
            <input className='col-sm-12 col-md-5 col-lg-5' type='date' placeholder='التاريخ' value={date} onChange={e => setdate(e.target.value)} />
          </div>
          <button className='col-sm-4 col-md-3 col-lg-3 btn-map' onClick={fetchTask}>تطبيق</button>
        </div>
      </div>
      <div className='col-sm-12 col-md-8 col-lg-8 map'>
        <ToastContainer /> {/* Include ToastContainer to display toast notifications */}
        <MapContainer center={[26.8206, 30.8025]} zoom={6} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {agent == -1 && agents.map(agent => (
            <AgentsMarker key={agent.id} agent={agent} />
          ))}
          {agent !== -1 && agentsLocation.map(agent => (
            <AgentLocationMarker key={agent.id} agent={agent} />
          ))}
         
         
        </MapContainer>
      </div>
    </div>
  );
};

export default AgentsMap2;

