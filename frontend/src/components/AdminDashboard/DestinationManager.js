import React, { useState, useEffect, useCallback } from 'react';
import DestinationDetail from './DestinationDetail';
import { getAdminDestinations, createDestination, deleteDestination } from '../../api';

function DestinationManager() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding a new destination
  const [newDestName, setNewDestName] = useState('');
  const [newDestDesc, setNewDestDesc] = useState('');
  const [newDestImages, setNewDestImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for switching to the detail view
  const [viewingDestId, setViewingDestId] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleImageChange = (e) => {
    setNewDestImages(e.target.files);
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', newDestName);
    formData.append('description', newDestDesc);
    for (let i = 0; i < newDestImages.length; i++) {
      formData.append('images', newDestImages[i]);
    }

    try {
      await createDestination(formData);
      // Reset form and refresh list
      setNewDestName('');
      setNewDestDesc('');
      setNewDestImages([]);
      document.getElementById('images').value = ''; // Clear file input
      fetchDestinations();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination? This will delete all associated programs, hotels, and activities.')) {
      return;
    }
    try {
      await deleteDestination(id);
      fetchDestinations(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  if (viewingDestId) {
    return <DestinationDetail destinationId={viewingDestId} onBack={() => setViewingDestId(null)} />;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h1 className="mb-4">Manage Destinations</h1>

      <div className="card mb-4">
        <div className="card-header">Add New Destination</div>
        <div className="card-body">
          <form onSubmit={handleAddDestination}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Destination Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={newDestName}
                onChange={(e) => setNewDestName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={newDestDesc}
                onChange={(e) => setNewDestDesc(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="images" className="form-label">Images</label>
              <input
                type="file"
                className="form-control"
                id="images"
                multiple
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Destination'}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Existing Destinations</div>
        <ul className="list-group list-group-flush">
          {destinations.length === 0 ? (
            <li className="list-group-item">No destinations found.</li>
          ) : (
            destinations.map(dest => (
              <li key={dest.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{dest.name}</h5>
                  <p className="mb-0 text-muted">{dest.description?.substring(0, 100)}...</p>
                </div>
                <div>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => setViewingDestId(dest.id)}>
                    Manage
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dest.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default DestinationManager;
