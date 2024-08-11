import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pin icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = ({ setLatLng }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const latlng = e.latlng;
      setPosition(latlng);
      setLatLng(latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
};

const MapModal = ({ show, handleClose, setLatLng, onConfirm }) => {
  const [localLatLng, setLocalLatLng] = useState(null);

  if (!show) return null;

  const handleConfirm = () => {
    if (localLatLng) {
      onConfirm(localLatLng);
    }
    handleClose(); // Close the modal after confirming
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <MapContainer center={[26.8206, 30.8025]} zoom={6} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker setLatLng={setLocalLatLng} />
        </MapContainer>
        <button onClick={handleConfirm} className="confirm-btn">Confirm Location</button>
      </div>
    </div>
  );
};

export default MapModal;
