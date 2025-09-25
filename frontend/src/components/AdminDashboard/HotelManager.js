import React, { useState, useEffect, useCallback } from 'react';
import { getAdminHotels, getAdminProgrammes, createHotel, deleteHotel, updateHotel, getImagesForHotel, addImageToHotel, deleteImage } from '../../api';

function HotelManager() {
  const [hotels, setHotels] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelDesc, setNewHotelDesc] = useState('');
  const [newHotelProgId, setNewHotelProgId] = useState('');

  // State for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editProgId, setEditProgId] = useState('');
  const [hotelImages, setHotelImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fetchHotelsAndProgrammes = useCallback(async () => {
    try {
      const [hotelsData, progData] = await Promise.all([
        getAdminHotels(),
        getAdminProgrammes()
      ]);
      setHotels(hotelsData);
      setProgrammes(progData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotelsAndProgrammes();
  }, [fetchHotelsAndProgrammes]);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!newHotelName || !newHotelProgId) {
      alert("Name and programme are required.");
      return;
    }
    try {
      await createHotel({ name: newHotelName, description: newHotelDesc, programme_id: parseInt(newHotelProgId) });
      setNewHotelName('');
      setNewHotelDesc('');
      setNewHotelProgId('');
      fetchHotelsAndProgrammes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await deleteHotel(id);
      fetchHotelsAndProgrammes();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchImages = async (hotelId) => {
    try {
        const data = await getImagesForHotel(hotelId);
        setHotelImages(data);
    } catch (err) { console.error("Failed to fetch hotel images"); }
  }

  const handleOpenEditModal = (hotel) => {
    setEditingHotel(hotel);
    setEditName(hotel.name);
    setEditDesc(hotel.description);
    setEditProgId(hotel.programme_id);
    fetchImages(hotel.id);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
    setHotelImages([]);
    setNewImages([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      await updateHotel(editingHotel.id, { name: editName, description: editDesc, programme_id: parseInt(editProgId) });
      fetchHotelsAndProgrammes(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async () => {
    if (newImages.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }
    try {
        await addImageToHotel(editingHotel.id, formData);
        setNewImages([]);
        document.getElementById('newHotelImages').value = '';
        fetchImages(editingHotel.id); // Refresh images
    } catch(err) { alert(err.message); }
  }

  const handleImageDelete = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
        await deleteImage(imageId);
        fetchImages(editingHotel.id); // Refresh images
    } catch(err) { alert(err.message); }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="mb-4">Manage Hotels</h1>
      <div className="card mb-4">
        <div className="card-header">Add New Hotel</div>
        <div className="card-body">
          <form onSubmit={handleAddHotel}>
            <div className="row">
              <div className="col-md-4 mb-3"><input type="text" className="form-control" value={newHotelName} onChange={e => setNewHotelName(e.target.value)} placeholder="Hotel Name" required /></div>
              <div className="col-md-3 mb-3">
                <select className="form-select" value={newHotelProgId} onChange={e => setNewHotelProgId(e.target.value)} required>
                  <option value="">-- Select Programme --</option>
                  {programmes.map(prog => (<option key={prog.id} value={prog.id}>{prog.title}</option>))}
                </select>
              </div>
              <div className="col-md-5 mb-3"><input type="text" className="form-control" value={newHotelDesc} onChange={e => setNewHotelDesc(e.target.value)} placeholder="Description" /></div>
            </div>
            <button type="submit" className="btn btn-primary">Add Hotel</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Existing Hotels</div>
        <ul className="list-group list-group-flush">
          {hotels.map(h => (
            <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div><h5>{h.name}</h5><small>Programme ID: {h.programme_id}</small></div>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenEditModal(h)}>Manage</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(h.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Manage Hotel: {editingHotel?.name}</h5><button type="button" className="btn-close" onClick={handleCloseEditModal}></button></div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-5">
                    <h5>Details</h5>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-3"><label htmlFor="editName" className="form-label">Name</label><input type="text" className="form-control" id="editName" value={editName} onChange={e => setEditName(e.target.value)} /></div>
                        <div className="mb-3"><label htmlFor="editDesc" className="form-label">Description</label><textarea className="form-control" id="editDesc" rows="3" value={editDesc} onChange={e => setEditDesc(e.target.value)}></textarea></div>
                        <div className="mb-3"><label htmlFor="editProgId" className="form-label">Programme</label>
                            <select className="form-select" id="editProgId" value={editProgId} onChange={e => setEditProgId(e.target.value)} required>
                                {programmes.map(prog => (<option key={prog.id} value={prog.id}>{prog.title}</option>))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Details</button>
                    </form>
                  </div>
                  <div className="col-md-7">
                    <h5>Images</h5>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex flex-wrap mb-3">
                                {hotelImages.map(img => (
                                <div key={img.id} className="position-relative m-1" style={{width: '120px', height: '80px'}}>
                                    <img src={`http://127.0.0.1:5000${img.url}`} alt="" className="img-fluid rounded" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    <button onClick={() => handleImageDelete(img.id)} className="btn btn-danger btn-sm position-absolute top-0 end-0" style={{lineHeight: '0.8', padding: '0.1rem 0.3rem'}}>×</button>
                                </div>
                                ))}
                            </div>
                            {hotelImages.length === 0 && <p className="text-muted text-center">No images yet.</p>}
                            <hr/>
                            <h6>Add New Images</h6>
                            <div className="input-group">
                                <input type="file" id="newHotelImages" className="form-control" multiple onChange={e => setNewImages(e.target.files)} />
                                <button type="button" className="btn btn-success" onClick={handleImageUpload}>Upload</button>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelManager;
