
import React, { useState, useEffect, useCallback } from 'react';

function ActivityManager() {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityDestId, setNewActivityDestId] = useState('');

  // State for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDestId, setEditDestId] = useState('');

  const username = localStorage.getItem('username');

  const fetchActivitiesAndDestinations = useCallback(async () => {
    try {
      const [activitiesRes, destRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/admin/activities?username=${username}`),
        fetch(`http://127.0.0.1:5000/api/admin/destinations?username=${username}`)
      ]);

      if (!activitiesRes.ok || !destRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const activitiesData = await activitiesRes.json();
      const destData = await destRes.json();
      
      setActivities(activitiesData);
      setDestinations(destData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) fetchActivitiesAndDestinations();
  }, [fetchActivitiesAndDestinations, username]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityName || !newActivityDestId) {
      alert("Le nom et l'ID de la destination sont requis.");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/activities?username=${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newActivityName, 
          description: newActivityDesc, 
          destination_id: parseInt(newActivityDestId) 
        })
      });
      if (!response.ok) throw new Error('Failed to add activity');
      setNewActivityName('');
      setNewActivityDesc('');
      setNewActivityDestId('');
      fetchActivitiesAndDestinations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/activities/${id}?username=${username}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("La suppression de l'activité a échoué.");
      fetchActivitiesAndDestinations(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenEditModal = (activity) => {
    setEditingActivity(activity);
    setEditName(activity.name);
    setEditDesc(activity.description);
    setEditDestId(activity.destination_id);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setEditName('');
    setEditDesc('');
    setEditDestId('');
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    if (!editingActivity) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/admin/activities/${editingActivity.id}?username=${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName, 
          description: editDesc, 
          destination_id: parseInt(editDestId) 
        })
      });

      if (!response.ok) throw new Error("La mise à jour de l'activité a échoué.");

      handleCloseEditModal();
      fetchActivitiesAndDestinations(); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="mb-4">Gestion des Activités</h1>
      <div className="card mb-4">
        <div className="card-header">Ajouter une nouvelle activité</div>
        <div className="card-body">
          <form onSubmit={handleAddActivity}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" value={newActivityName} onChange={e => setNewActivityName(e.target.value)} placeholder="Nom de l'activité" required />
              </div>
              <div className="col-md-3 mb-3">
                <select className="form-select" value={newActivityDestId} onChange={e => setNewActivityDestId(e.target.value)} required>
                  <option value="">-- Choisir une destination --</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-5 mb-3">
                <input type="text" className="form-control" value={newActivityDesc} onChange={e => setNewActivityDesc(e.target.value)} placeholder="Description" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Ajouter l'activité</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Liste des activités</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {activities.map(a => (
              <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{a.name}</h5>
                  <p className="mb-0">{a.description}</p>
                  <small>Destination ID: {a.destination_id}</small>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenEditModal(a)}>Modifier</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteActivity(a.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Activity Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateActivity}>
                <div className="modal-header">
                  <h5 className="modal-title">Modifier l'activité</h5>
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

export default ActivityManager;
