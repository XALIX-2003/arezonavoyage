import React, { useState, useEffect } from 'react';
import ProgramCard from '../ProgramCard/ProgramCard';
import { getProgrammes } from '../../api'; // Import the new API function

function Programmes() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await getProgrammes();
        setProgrammes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  if (loading) {
    return <div className="text-center"><p>Loading programmes...</p></div>;
  }

  if (error) {
    return <div className="alert alert-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      <h2 className="text-center mb-4">Our Programmes</h2>
      <div className="row">
        {programmes.length > 0 ? (
          programmes.map(prog => (
            <div key={prog.id} className="col-lg-4 col-md-6 mb-4">
              <ProgramCard program={prog} />
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No programmes available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Programmes;
