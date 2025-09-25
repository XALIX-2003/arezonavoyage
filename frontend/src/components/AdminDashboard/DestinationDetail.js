import React, { useState, useEffect, useCallback } from 'react';
import ProgrammeEditor from './ProgrammeEditor';
import {
    getAdminDestinationDetails,
    getImagesForDestination,
    getProgrammesForDestination,
    createProgramme,
    deleteProgramme,
    updateDestination,
    deleteImage,
    addImageToDestination
} from '../../api';

function DestinationDetail({ destinationId, onBack }) {
  const [destination, setDestination] = useState(null);
  const [images, setImages] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingProgramme, setEditingProgramme] = useState(null);
  const [newProgrammeTitle, setNewProgrammeTitle] = useState('');
  const [newProgrammePrice, setNewProgrammePrice] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUpdatingDest, setIsUpdatingDest] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [destData, imagesData, progData] = await Promise.all([
        getAdminDestinationDetails(destinationId),
        getImagesForDestination(destinationId),
        getProgrammesForDestination(destinationId),
      ]);

      setDestination(destData);
      setImages(imagesData);
      setProgrammes(progData);
      setName(destData.name);
      setDescription(destData.description);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProgrammeSave = () => {
    setEditingProgramme(null);
    fetchData();
  };

  const handleAddProgramme = async (e) => {
    e.preventDefault();
    try {
        await createProgramme({ 
            title: newProgrammeTitle,
            price: parseFloat(newProgrammePrice) || 0,
            destination_id: destinationId
        });
        setNewProgrammeTitle('');
        setNewProgrammePrice('');
        fetchData();
    } catch (err) {
        setError(err.message);
    }
  };

  const handleDeleteProgramme = async (progId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
        await deleteProgramme(progId);
        fetchData();
    } catch (err) {
        setError(err.message);
    }
  };

  const handleDetailsUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingDest(true);
    try {
      await updateDestination(destinationId, { name, description });
      alert('Details updated!');
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingDest(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteImage(imageId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewImagesUpload = async (e) => {
    e.preventDefault();
    const files = e.target.elements.newImages.files;
    if (!files || files.length === 0) {
        alert('Please select one or more files to upload.');
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      await addImageToDestination(destinationId, formData);
      e.target.reset(); // Reset the form, clearing the file input
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
      alert(`Upload Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="alert alert-danger">Error: {error} <button onClick={onBack} className="btn btn-secondary">Back</button></div>;
  if (!destination) return <div>No destination found. <button onClick={onBack} className="btn btn-secondary">Back</button></div>;

  return (
    <div>
      <button onClick={onBack} className="btn btn-secondary mb-4">← Back to List</button>
      <h2>Manage: {destination.name}</h2>
      
      <div className="card mb-4">
        <div className="card-header">Edit Details</div>
        <div className="card-body">
          <form onSubmit={handleDetailsUpdate}>
            <div className="mb-3">
              <label htmlFor="destName" className="form-label">Name</label>
              <input type="text" id="destName" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="destDesc" className="form-label">Description</label>
              <textarea id="destDesc" className="form-control" rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isUpdatingDest}>{isUpdatingDest ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Manage Images</div>
        <div className="card-body">
          <h5>Existing Images</h5>
          <div className="d-flex flex-wrap mb-3">
            {images.map(img => (
              <div key={img.id} className="position-relative m-2" style={{width: '150px', height: '100px'}}>
                <img src={`http://127.0.0.1:5000${img.url}`} alt="" className="img-fluid rounded" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <button onClick={() => handleImageDelete(img.id)} className="btn btn-danger btn-sm position-absolute top-0 end-0" style={{lineHeight: '1', padding: '0.1rem 0.3rem'}}>×</button>
              </div>
            ))}
          </div>
          <hr/>
          <h5>Add New Images</h5>
          <form onSubmit={handleNewImagesUpload}>
            <div className="mb-3">
              <input type="file" id="newImages" name="newImages" className="form-control" multiple />
            </div>
            <button type="submit" className="btn btn-success">Upload</button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header"><h4>Manage Programmes</h4></div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {programmes.map(prog => (
              <li key={prog.id} className="list-group-item">
                {editingProgramme?.id === prog.id ? (
                  <ProgrammeEditor 
                    programme={prog} 
                    onSave={handleProgrammeSave} 
                    onCancel={() => setEditingProgramme(null)} 
                  />
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{prog.title}</strong>
                      <br />
                      <span className="text-muted">Price: {prog.price} €</span>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingProgramme(prog)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProgramme(prog.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer">
            <h5>Add New Programme</h5>
            <form onSubmit={handleAddProgramme}>
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="New programme title" 
                        value={newProgrammeTitle} 
                        onChange={e => setNewProgrammeTitle(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Price (€)" 
                        value={newProgrammePrice} 
                        onChange={e => setNewProgrammePrice(e.target.value)} 
                        required 
                    />
                    <button className="btn btn-success" type="submit">Add</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;