import React, { useState, useEffect, useCallback } from 'react';

function HotelManager() {
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]); // Ajout pour le menu déroulant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelDesc, setNewHotelDesc] = useState('');
  const [newHotelDestId, setNewHotelDestId] = useState('');

  // State for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDestId, setEditDestId] = useState('');

  const username = localStorage.getItem('username');

  const fetchHotelsAndDestinations = useCallback(async () => {
    try {
      const [hotelsRes, destRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/admin/hotels?username=${username}`),
        fetch(`http://127.0.0.1:5000/api/admin/destinations?username=${username}`)
      ]);

      if (!hotelsRes.ok || !destRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const hotelsData = await hotelsRes.json();
      const destData = await destRes.json();
      
      setHotels(hotelsData);
      setDestinations(destData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) fetchHotelsAndDestinations();
  }, [fetchHotelsAndDestinations, username]);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!newHotelName || !newHotelDestId) {
      alert("Le nom et l'ID de la destination sont requis.");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/hotels?username=${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newHotelName, 
          description: newHotelDesc, 
          destination_id: parseInt(newHotelDestId) 
        })
      });
      if (!response.ok) throw new Error('Failed to add hotel');
      setNewHotelName('');
      setNewHotelDesc('');
      setNewHotelDestId('');
      fetchHotelsAndDestinations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/hotels/${id}?username=${username}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("La suppression de l'hôtel a échoué.");
      fetchHotelsAndDestinations(); // Rafraîchit la liste
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenEditModal = (hotel) => {
    setEditingHotel(hotel);
    setEditName(hotel.name);
    setEditDesc(hotel.description);
    setEditDestId(hotel.destination_id);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
    setEditName('');
    setEditDesc('');
    setEditDestId('');
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/hotels/${editingHotel.id}?username=${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          description: editDesc, 
          destination_id: parseInt(editDestId) 
        })
      });

      if (!response.ok) throw new Error("La mise à jour de l'hôtel a échoué.");

      handleCloseEditModal();
      fetchHotelsAndDestinations(); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="mb-4">Gestion des Hôtels</h1>
      <div className="card mb-4">
        <div className="card-header">Ajouter un nouvel hôtel</div>
        <div className="card-body">
          <form onSubmit={handleAddHotel}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={newHotelName} onChange={e => setNewHotelName(e.target.value)} placeholder="Nom de l'hôtel" required />
              </div>
              <div className="col-md-3 mb-3">
                <select className="form-select" value={newHotelDestId} onChange={e => setNewHotelDestId(e.target.value)} required>
                  <option value="">-- Choisir une destination --</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-5 mb-3">
                <input type="text" className="form-control" value={newHotelDesc} onChange={e => setNewHotelDesc(e.target.value)} placeholder="Description" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Ajouter l'hôtel</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Liste des hôtels</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {hotels.map(h => (
              <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{h.name}</h5>
                  <p className="mb-0">{h.description}</p>
                  <small>Destination ID: {h.destination_id}</small>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenEditModal(h)}>Modifier</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteHotel(h.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Hotel Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateHotel}>
                <div className="modal-header">
                  <h5 className="modal-title">Modifier l'hôtel</h5>
                  <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">Nom</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="editName" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDesc" className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      id="editDesc" 
                      rows="3"
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDestId" className="form-label">Destination</label>
                    <select className="form-select" id="editDestId" value={editDestId} onChange={e => setEditDestId(e.target.value)} required>
                      <option value="">-- Choisir une destination --</option>
                      {destinations.map(dest => (
                        <option key={dest.id} value={dest.id}>{dest.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HotelManager;