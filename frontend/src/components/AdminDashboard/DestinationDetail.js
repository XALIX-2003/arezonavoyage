import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://127.0.0.1:5000';

// Un petit composant pour gérer les dates d'un programme
function DateManager({ programme, username, onUpdate }) {
  const [newDate, setNewDate] = useState('');

  const handleAddDate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/programmes/${programme.id}/dates?username=${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate })
      });
      if (!response.ok) throw new Error('Failed to add date');
      setNewDate('');
      onUpdate(); // Rafraîchir les données du composant parent
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (!window.confirm('Supprimer cette date ?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/available_dates/${dateId}?username=${username}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete date');
      onUpdate(); // Rafraîchir
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-3 ps-3 border-start">
      <h6>Dates disponibles</h6>
      <ul className="list-unstyled">
        {programme.available_dates.map(d => (
          <li key={d.id} className="d-flex justify-content-between align-items-center mb-1">
            <span>{new Date(d.date).toLocaleDateString()}</span>
            <button className="btn btn-xs btn-outline-danger" onClick={() => handleDeleteDate(d.id)}>X</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddDate} className="d-flex">
        <input type="date" className="form-control form-control-sm me-2" value={newDate} onChange={e => setNewDate(e.target.value)} required />
        <button type="submit" className="btn btn-sm btn-success">+</button>
      </form>
    </div>
  )
}

function DestinationDetail({ destinationId, onBack }) {
  // ... (états existants pour programmes, images, etc.)
  const [programmes, setProgrammes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const username = localStorage.getItem('username');

  const fetchData = useCallback(async () => {
    // ... (logique de fetch existante)
  }, [destinationId, username]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ... (tous les gestionnaires d'événements existants)

  return (
    <div>
      <button className="btn btn-link mb-3" onClick={onBack}>&larr; Retour à la liste</button>
      <h1>Gestion de la Destination</h1>
      <hr />

      {/* Section pour les Programmes */}
      <div className="card mt-4">
        <div className="card-header">Programmes</div>
        <div className="card-body">
          {/* ... (formulaire d'ajout de programme) ... */}
          <hr/>
          <h5 className="card-title">Programmes existants</h5>
          <ul className="list-group">
            {programmes.map(p => (
              <li key={p.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div><strong>{p.title}</strong> - {p.price ? `${p.price} €` : 'Prix non défini'}<br/><small>{p.description}</small></div>
                  <button className="btn btn-sm btn-outline-danger">Supprimer</button>
                </div>
                <DateManager programme={p} username={username} onUpdate={fetchData} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section pour les Photos */}
      {/* ... (logique existante pour les photos) ... */}
    </div>
  );
}

export default DestinationDetail;