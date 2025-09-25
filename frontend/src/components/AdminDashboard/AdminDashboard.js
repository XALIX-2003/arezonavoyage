
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientManager from './ClientManager'; // Nous allons déplacer la logique client ici
import DestinationManager from './DestinationManager';
import HotelManager from './HotelManager';
import ActivityManager from './ActivityManager';

function AdminDashboard() {
  const [activeView, setActiveView] = useState('clients'); // 'clients' ou 'destinations'
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    localStorage.removeItem('username');
    navigate('/admin/login');
  };

  const renderView = () => {
    switch (activeView) {
      case 'destinations':
        return <DestinationManager />;
      case 'hotels':
        return <HotelManager />;
      case 'activities':
        return <ActivityManager />;
      case 'clients':
      default:
        return <ClientManager />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar Menu */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '250px' }}>
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4">Admin Panel</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <button className={`nav-link text-white ${activeView === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveView('clients')}>
              Clients
            </button>
          </li>
          <li>
            <button className={`nav-link text-white ${activeView === 'destinations' ? 'active' : ''}`}
              onClick={() => setActiveView('destinations')}>
              Destinations
            </button>
          </li>
          <li>
            <button className={`nav-link text-white ${activeView === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveView('hotels')}>
              Hôtels
            </button>
          </li>
          <li>
            <button className={`nav-link text-white ${activeView === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveView('activities')}>
              Activités
            </button>
          </li>
          {/* Les futurs liens (Hôtels, Activités) iront ici */}
        </ul>
        <hr />
        <div>
          <button onClick={handleLogout} className="btn btn-warning">Déconnexion</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        {renderView()}
      </div>
    </div>
  );
}

export default AdminDashboard;
