import React from 'react';
import { Link } from 'react-router-dom';
import './ProgramCard.css'; // Keep the styles for now

// This component is now effectively a "ProgramCard"
function ProgramCard({ program }) { // Changed prop destructuring
  const { id, title, description, price, image, available_dates } = program; // Added available_dates
  const BACKEND_URL = 'http://127.0.0.1:5000';

  // Construct the full image URL
  const imageUrl = image ? `${BACKEND_URL}${image}` : `${BACKEND_URL}/uploads/placeholder.png`;

  return (
    <div className="card program-card h-100 shadow-sm">
      <img src={imageUrl} className="card-img-top" alt={title} /> {/* Changed alt to title */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5> {/* Changed to title */}
        <p className="card-text text-muted">{description?.substring(0, 120)}...</p>
        {price && <p className="card-text"><strong>Price: {price}€</strong></p>} {/* Display price */}
        
        {/* Display Available Dates */}
        {available_dates && available_dates.length > 0 && (
          <div className="mt-2">
            <h6>Available Dates:</h6>
            <ul className="list-unstyled">
              {available_dates.map((date, index) => (
                <li key={index}>{new Date(date).toLocaleDateString('fr-FR')}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto">
          <Link to={`/programmes/${id}`} className="btn btn-primary w-100">View Details</Link> {/* Changed link to programmes */}
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;