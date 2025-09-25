import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Activites() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/programmes');
        if (!response.ok) {
          throw new Error('Failed to fetch programmes');
        }
        const data = await response.json();
        setProgrammes(data);
      } catch (error) {
        console.error("Error fetching programmes:", error);
        // Optionally, set an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-center mb-5">Tous Nos Programmes</h1>
      <div className="row g-4">
        {programmes.length > 0 ? (
          programmes.map(programme => (
            <div key={programme.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img src={programme.image} className="card-img-top" alt={programme.title} style={{ height: '220px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{programme.title}</h5>
                  <p className="card-text text-muted">{programme.destination_name}</p>
                  <p className="card-text">{programme.description.substring(0, 100)}...</p>
                  <div className="mt-auto">
                    <Link to={`/programmes/${programme.id}`} className="btn btn-primary w-100">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">Aucun programme disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Activites;
