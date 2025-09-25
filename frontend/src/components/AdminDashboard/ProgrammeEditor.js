import React, { useState, useEffect, useCallback } from 'react';
import {
    getProgramDays,
    getProgramDates,
    getAdminHotels,
    updateProgramme,
    createProgramDay,
    updateProgramDay,
    deleteProgramDay,
    createDateForProgramme,
    deleteAvailableDate,
    createHotel,
    deleteHotel
} from '../../api';

// A small sub-component for editing a single day
function DayEditor({ day, onSave, onCancel }) {
    const [title, setTitle] = useState(day.title || '');
    const [description, setDescription] = useState(day.description || '');

    const handleSave = () => {
        onSave({ ...day, title, description });
    };

    return (
        <div className="p-2 border rounded bg-white mb-2 shadow-sm">
            <input type="text" className="form-control form-control-sm mb-1" value={title} onChange={e => setTitle(e.target.value)} placeholder={`Day ${day.day_number} Title`} />
            <textarea className="form-control form-control-sm" value={description} onChange={e => setDescription(e.target.value)} placeholder="Day description" rows="3"></textarea>
            <div className="mt-2">
                <button onClick={handleSave} className="btn btn-success btn-sm me-2">Save Day</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">Cancel</button>
            </div>
        </div>
    );
}

function ProgrammeEditor({ programme, onSave, onCancel }) {
  // Main programme details
  const [title, setTitle] = useState(programme.title || '');
  const [description, setDescription] = useState(programme.description || '');
  const [price, setPrice] = useState(programme.price || '');
  
  // Day-by-day details
  const [days, setDays] = useState([]);
  const [editingDay, setEditingDay] = useState(null);

  // Availability dates
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState('');

  // Hotels for this programme
  const [hotels, setHotels] = useState([]);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelDesc, setNewHotelDesc] = useState('');
  const [newHotelImages, setNewHotelImages] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgrammeDetails = useCallback(async () => {
    try {
        const [daysData, datesData, allHotelsData] = await Promise.all([
            getProgramDays(programme.id),
            getProgramDates(programme.id),
            getAdminHotels()
        ]);

        setDays(daysData);
        setDates(datesData);
        // Filter hotels by current programme_id
        setHotels(allHotelsData.filter(hotel => hotel.programme_id === programme.id));

    } catch (err) {
        setError(err.message);
    }
  }, [programme.id]);

  useEffect(() => {
    fetchProgrammeDetails();
  }, [fetchProgrammeDetails]);

  const handleMainDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await updateProgramme(programme.id, { title, description, price: parseFloat(price) || 0 });
      onSave(); // This will trigger a refresh from the parent
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDay = async () => {
    const dayNumber = (days[days.length - 1]?.day_number || 0) + 1;
    try {
        await createProgramDay(programme.id, { day_number: dayNumber, title: `Day ${dayNumber}`, description: 'New description' });
        fetchProgrammeDetails();
    } catch(err) { setError(err.message); }
  }

  const handleUpdateDay = async (dayToSave) => {
    try {
        await updateProgramDay(dayToSave.id, dayToSave);
        setEditingDay(null);
        fetchProgrammeDetails();
    } catch(err) { setError(err.message); }
  }

  const handleDeleteDay = async (dayId) => {
    if(!window.confirm('Delete this day?')) return;
    try {
        await deleteProgramDay(dayId);
        fetchProgrammeDetails();
    } catch(err) { setError(err.message); }
  }

  const handleAddDate = async () => {
    if(!newDate) return;
    try {
        await createDateForProgramme(programme.id, { date: newDate });
        setNewDate('');
        fetchProgrammeDetails();
    } catch(err) { setError(err.message); }
  }

  const handleDeleteDate = async (dateId) => {
    try {
        await deleteAvailableDate(dateId);
        fetchProgrammeDetails();
    } catch(err) { setError(err.message); }
  }

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await createHotel({ 
          name: newHotelName, 
          description: newHotelDesc, 
          programme_id: programme.id 
        });

      setNewHotelName('');
      setNewHotelDesc('');
      fetchProgrammeDetails();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }
    try {
      await deleteHotel(hotelId);
      fetchProgrammeDetails(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card bg-light mb-4 border-primary">
        <div className="card-body">
            <h4 className="card-title">Edit Programme: {programme.title}</h4>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleMainDetailsSubmit} className="mb-4 p-3 border rounded bg-white">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Price (€)</label>
                    <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Main Details'}
                </button>
            </form>

            <div className="mb-4 p-3 border rounded bg-white">
                <h5>Day-by-Day Programme</h5>
                {days.map(day => (
                    <div key={day.id} className="mb-2">
                        {editingDay?.id === day.id ? (
                            <DayEditor day={day} onSave={handleUpdateDay} onCancel={() => setEditingDay(null)} />
                        ) : (
                            <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                                <div><strong>Day {day.day_number}:</strong> {day.title}</div>
                                <div>
                                    <button onClick={() => setEditingDay(day)} className="btn btn-sm btn-outline-primary me-1">Edit</button>
                                    <button onClick={() => handleDeleteDay(day.id)} className="btn btn-sm btn-outline-danger">Del</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={handleAddDay} className="btn btn-sm btn-success mt-2">+ Add Day</button>
            </div>

            <div className="mb-4 p-3 border rounded bg-white">
                <h5>Availability Dates</h5>
                <ul className="list-group mb-2">
                    {dates.map(d => (
                        <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {d.date}
                            <button onClick={() => handleDeleteDate(d.id)} className="btn btn-sm btn-danger">X</button>
                        </li>
                    ))}
                </ul>
                 <div className="input-group">
                    <input type="date" className="form-control" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <button onClick={handleAddDate} className="btn btn-sm btn-success">+ Add Date</button>
                </div>
            </div>

            {/* Hotel Management Section */}
            <div className="mb-4 p-3 border rounded bg-white">
                <h5>Hotels for this Programme</h5>
                {hotels.length === 0 ? (
                    <p>No hotels associated with this programme.</p>
                ) : (
                    <ul className="list-group mb-3">
                        {hotels.map(hotel => (
                            <li key={hotel.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{hotel.name}</strong>
                                    <p className="text-muted mb-0">{hotel.description?.substring(0, 50)}...</p>
                                </div>
                                <div>
                                    {/* Add edit functionality later if needed */}
                                    <button onClick={() => handleDeleteHotel(hotel.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <h6>Add New Hotel</h6>
                <form onSubmit={handleAddHotel}>
                    <div className="mb-3">
                        <label htmlFor="newHotelName" className="form-label">Hotel Name</label>
                        <input type="text" className="form-control" id="newHotelName" value={newHotelName} onChange={e => setNewHotelName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newHotelDesc" className="form-label">Description</label>
                        <textarea className="form-control" id="newHotelDesc" rows="3" value={newHotelDesc} onChange={e => setNewHotelDesc(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success" disabled={isSaving}>Add Hotel</button>
                </form>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={isSaving}>Close Editor</button>
                <button type="button" className="btn btn-primary" onClick={handleMainDetailsSubmit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save All Main Details'}
                </button>
            </div>
        </div>
    </div>
  );
}

export default ProgrammeEditor;
