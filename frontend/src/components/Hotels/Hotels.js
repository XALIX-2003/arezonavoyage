import React, { useState, useEffect } from 'react';
import { getHotels } from '../../api';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) return <div className="text-center">Loading hotels...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-center mb-5">Our Partner Hotels</h1>
      <p className="text-center text-muted mb-5">We select charming hotels and riads to ensure your comfort during your stay.</p>
      <div className="row g-4">
        {hotels.length === 0 ? (
          <p className="text-center text-muted">No hotels available at the moment.</p>
        ) : (
          hotels.map(hotel => (
            <div key={hotel.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                {hotel.image ? (
                  <img src={`${BACKEND_URL}${hotel.image}`} className="card-img-top" alt={hotel.name} style={{ height: '250px', objectFit: 'cover' }} />
                ) : (
                  <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '250px' }}><small>No image</small></div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{hotel.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {hotel.programme_name} ({hotel.destination_name})
                  </h6>
                  <p className="card-text">{hotel.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Hotels;
