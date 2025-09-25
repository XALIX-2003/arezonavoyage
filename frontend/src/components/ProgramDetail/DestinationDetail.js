import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationDetails } from '../../api';

function DestinationDetail() {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const BACKEND_URL = 'http://127.0.0.1:5000';

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            try {
                const data = await getDestinationDetails(id);
                setDestination(data);
                if (data.programmes && data.programmes.length > 0) {
                    setActiveTab(data.programmes[0].id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinationDetails();
    }, [id]);

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!destination) return <div className="text-center p-5">Destination not found.</div>;

    return (
        <div className="container-fluid px-0">
            {destination.images && destination.images.length > 0 && (
                <div id="destCarousel" className="carousel slide">
                    <div className="carousel-inner">
                        {destination.images.map((imgUrl, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img src={`${BACKEND_URL}${imgUrl}`} className="d-block w-100" alt={`View of ${destination.name} ${index + 1}`} style={{ height: '60vh', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#destCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
                    <button className="carousel-control-next" type="button" data-bs-target="#destCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
                </div>
            )}

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1>{destination.name}</h1>
                    <p className="lead">{destination.description}</p>
                </div>

                {destination.programmes && destination.programmes.length > 0 ? (
                    <>
                        <ul className="nav nav-tabs" id="programmeTabs" role="tablist">
                            {destination.programmes.map(prog => (
                                <li className="nav-item" role="presentation" key={prog.id}>
                                    <button 
                                        className={`nav-link ${activeTab === prog.id ? 'active' : ''}`}
                                        id={`tab-${prog.id}`}
                                        data-bs-toggle="tab" 
                                        data-bs-target={`#content-${prog.id}`}
                                        type="button" 
                                        role="tab"
                                        onClick={() => setActiveTab(prog.id)}>
                                        {prog.title}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="tab-content" id="programmeTabContent">
                            {destination.programmes.map(prog => (
                                <div 
                                    className={`tab-pane fade ${activeTab === prog.id ? 'show active' : ''}`}
                                    id={`content-${prog.id}`} 
                                    role="tabpanel" 
                                    key={prog.id}>
                                    <div className="p-4">
                                        <h4>{prog.title}</h4>
                                        <p>{prog.description}</p>
                                        <p><strong>Price:</strong> {prog.price}€</p>
                                        
                                        <h5>Programme Day by Day</h5>
                                        {prog.program_days && prog.program_days.map(day => (
                                            <div key={day.day_number}>
                                                <strong>Day {day.day_number}: {day.title}</strong>
                                                <p>{day.description}</p>
                                            </div>
                                        ))}

                                        <h5>Available Dates</h5>
                                        <ul>
                                            {prog.available_dates && prog.available_dates.map(date => (
                                                <li key={date}>{new Date(date).toLocaleDateString('fr-FR')}</li>
                                            ))}
                                        </ul>

                                        <h5>Hotel</h5>
                                        {prog.hotels && prog.hotels.length > 0 ? (
                                            prog.hotels.map(hotel => (
                                                <div key={hotel.id} className="card mb-3">
                                                    <div className="row g-0">
                                                        <div className="col-md-4">
                                                            <img src={`${BACKEND_URL}${hotel.image}`} className="img-fluid rounded-start" alt={hotel.name} />
                                                        </div>
                                                        <div className="col-md-8">
                                                            <div className="card-body">
                                                                <h5 className="card-title">{hotel.name}</h5>
                                                                <p className="card-text">{hotel.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hotel information available for this program.</p>
                                        )}
                                        <Link to={`/programmes/${prog.id}`} className="btn btn-primary">View Program Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center">No programmes available for this destination.</p>
                )}
            </div>
        </div>
    );
}

export default DestinationDetail;
