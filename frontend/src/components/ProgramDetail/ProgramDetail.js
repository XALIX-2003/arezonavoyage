import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgrammeDetails, bookProgram } from '../../api';

// --- Reusable Booking Form Component ---
const BookingForm = ({ program, onBooking }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [travelerCount, setTravelerCount] = useState(1);
    const [travelers, setTravelers] = useState([]);
    const [step, setStep] = useState('select');

    const handleProceed = () => {
        if (!selectedDate) { alert('Please select a date.'); return; }
        setTravelers(Array.from({ length: travelerCount }, () => ({ nom: '', prenom: '', email: '', telephone: '' })));
        setStep('fillInfo');
    };

    const handleTravelerChange = (index, event) => {
        const newTravelers = [...travelers];
        newTravelers[index][event.target.name] = event.target.value;
        setTravelers(newTravelers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            programTitle: program.title,
            selectedDate,
            travelers,
            price: program.price
        };
        onBooking(bookingData);
    };

    if (step === 'select') {
        return (
            <div className="row p-3 bg-light rounded mt-3">
                <div className="col-md-6 mb-2"><label>Date</label><select className="form-select" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}><option value="">Select a date</option>{program.available_dates.map(date => <option key={date} value={date}>{new Date(date).toLocaleDateString('fr-FR')}</option>)}</select></div>
                <div className="col-md-6 mb-2"><label>Travelers</label><input type="number" className="form-control" min="1" value={travelerCount} onChange={e => setTravelerCount(parseInt(e.target.value, 10))} /></div>
                <div className="col-12"><button className="btn btn-primary w-100" onClick={handleProceed} disabled={!selectedDate}>Fill Traveler Info</button></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-3 bg-light rounded mt-3">
            <p>Booking for {travelerCount} on {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
            {travelers.map((_, index) => (
                <div key={index} className="row g-2 mb-2 border p-2 rounded">
                    <h6 className="col-12">Traveler {index + 1}</h6>
                    <div className="col-md-6"><input type="text" name="nom" placeholder="Last Name" className="form-control" required onChange={e => handleTravelerChange(index, e)} /></div>
                    <div className="col-md-6"><input type="text" name="prenom" placeholder="First Name" className="form-control" required onChange={e => handleTravelerChange(index, e)} /></div>
                    <div className="col-md-6"><input type="email" name="email" placeholder="Email" className="form-control" required onChange={e => handleTravelerChange(index, e)} /></div>
                    <div className="col-md-6"><input type="tel" name="telephone" placeholder="Phone" className="form-control" required onChange={e => handleTravelerChange(index, e)} /></div>
                </div>
            ))}
            <button type="submit" className="btn btn-success">Confirm Booking</button>
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => setStep('select')}>Back</button>
        </form>
    );
};

function ProgramDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openBookingForm, setOpenBookingForm] = useState(false);
    const BACKEND_URL = 'http://127.0.0.1:5000';

    useEffect(() => {
        const fetchProgrammeDetails = async () => {
            try {
                const data = await getProgrammeDetails(id);
                setProgram(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProgrammeDetails();
    }, [id]);

    const handleBooking = async (bookingData) => {
        try {
            await bookProgram(bookingData);
            navigate('/thank-you');
        } catch (err) {
            alert(`Booking Error: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!program) return <div className="text-center p-5">Program not found.</div>;

    return (
        <div className="container-fluid px-0">
            {/* Program Image */}
            {program.image && (
                <div style={{ height: '60vh', background: `url(${BACKEND_URL}${program.image}) center center / cover no-repeat` }} />
            )}

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1>{program.title}</h1>
                    <p className="lead">{program.description}</p>
                    {program.price && <h2>{program.price}€</h2>}
                </div>

                {/* Program Details */}
                <section className="my-5">
                    <h2 className="mb-4 text-center">Day by Day Itinerary</h2>
                    {program.program_days && program.program_days.length > 0 ? (
                        program.program_days.map(day => (
                            <div key={day.day_number} className="mb-3">
                                <strong>Day {day.day_number}: {day.title}</strong>
                                <p>{day.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No itinerary available for this program.</p>
                    )}
                </section>

                {/* Hotels for this Programme */}
                {program.hotels && program.hotels.length > 0 && (
                    <section className="my-5">
                        <h2 className="mb-4 text-center">Hotels for this Programme</h2>
                        <div className="row">
                            {program.hotels.map(hotel => (
                                <div key={hotel.id} className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        {hotel.image ? (
                                            <img src={`${BACKEND_URL}${hotel.image}`} className="card-img-top" alt={hotel.name} style={{ height: '150px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '150px' }}><small>No image</small></div>
                                        )}
                                        <div className="card-body">
                                            <h6 className="card-title">{hotel.name}</h6>
                                            <p className="card-text text-muted">{hotel.description?.substring(0, 80)}...</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Booking Section */}
                <section className="my-5 text-center">
                    <button className="btn btn-primary btn-lg" onClick={() => setOpenBookingForm(!openBookingForm)}>
                        {openBookingForm ? 'Cancel' : 'Book This Programme'}
                    </button>
                    {openBookingForm && <BookingForm program={program} onBooking={handleBooking} />}
                </section>
            </div>
        </div>
    );
}

export default ProgramDetail;
