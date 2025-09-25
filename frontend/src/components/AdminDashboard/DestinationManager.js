
import React, { useState, useEffect, useCallback } from 'react';
import DestinationDetail from './DestinationDetail'; // Importer le nouveau composant

function DestinationManager() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newDestName, setNewDestName] = useState('');
  const [newDestDesc, setNewDestDesc] = useState('');

  // State pour la vue de détail
  const [viewingDestId, setViewingDestId] = useState(null);

  const username = localStorage.getItem('username');

  const fetchDestinations = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/destinations?username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchDestinations();
    }
  }, [fetchDestinations, username]);

  const handleAddDestination = async (e) => {
    e.preventDefault();
    // ... (logique existante)
  };

  const handleDeleteDestination = async (id) => {
    // ... (logique existante)
  };

  // Si on regarde une destination en détail, on affiche le composant de détail
  if (viewingDestId) {
    return <DestinationDetail destinationId={viewingDestId} onBack={() => setViewingDestId(null)} />
  }

  // Sinon, on affiche la liste et le formulaire d'ajout
  return (
    <div>
      <h1 className="mb-4">Gestion des Destinations</h1>

      {/* Add Destination Form */}
      <div className="card mb-4">
        {/* ... (formulaire existant) ... */}
      </div>

      {/* Destinations List */}
      <div className="card">
        <div className="card-header">Liste des destinations</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {destinations.map(dest => (
              <li key={dest.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{dest.name}</h5>
                  <p className="mb-0">{dest.description}</p>
                </div>
                <div>
                  {/* Ce bouton navigue vers la vue de détail */}
                  <button className="btn btn-sm btn-primary me-2" onClick={() => setViewingDestId(dest.id)}>Gérer</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDestination(dest.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DestinationManager;
