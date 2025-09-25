import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelDetails } from '../../api';

function HotelDetail() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_URL = 'http://127.0.0.1:5000';

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const data = await getHotelDetails(id);
                setHotel(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!hotel) return <div className="text-center">Hotel not found.</div>;

    return (
        <div className="container py-5">
            {/* Hotel Image Carousel */}
            {hotel.images && hotel.images.length > 0 && (
                <div id="hotelCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {hotel.images.map((img, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img src={`${BACKEND_URL}${img}`} className="d-block w-100" alt={`${hotel.name} view ${index + 1}`} style={{ height: '60vh', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#hotelCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#hotelCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            )}

            {/* Hotel Info */}
            <div className="text-center">
                <h1>{hotel.name}</h1>
                <p className="lead">{hotel.description}</p>
            </div>
        </div>
    );
}

export default HotelDetail;