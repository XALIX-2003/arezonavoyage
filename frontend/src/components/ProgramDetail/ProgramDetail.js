import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programsData } from '../../data';
import './ProgramDetail.css';

function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = programsData.find(p => p.id === parseInt(id));

  const [selectedDate, setSelectedDate] = useState(program ? program.availableDates[0] : '');
  const [travelerCount, setTravelerCount] = useState(1);

  if (!program) {
    return (
        <div className="text-center">
            <h2>Programme non trouvé</h2>
            <Link to="/programmes">Retourner à la liste des programmes</Link>
        </div>
    );
  }

  const handleBooking = () => {
    navigate('/booking', {
        state: {
            program,
            selectedDate,
            travelerCount
        }
    });
  };

  return (
    <div className="program-detail-container">
        <div className="row">
            <div className="col-md-8">
                <img src={program.image} alt={program.title} className="img-fluid rounded mb-4" />
                <h1 className="mb-3">{program.title}</h1>
                <p className="lead text-muted">{program.destination}</p>
                <hr />
                <h3 className="mt-4">Programme détaillé (jour par jour)</h3>
                <pre className="program-details-pre">{program.details}</pre>
            </div>
            <div className="col-md-4">
                <div className="booking-card p-4 rounded shadow-sm">
                    <h3 className="mb-3">Réservez votre place</h3>
                    <div className="mb-3">
                        <span className="fs-2 fw-bold">{program.price} €</span>
                        <span className="text-muted"> / personne</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateSelect" className="form-label">Choisissez votre date de départ</label>
                        <select className="form-select" id="dateSelect" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
                            {program.availableDates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="travelerCount" className="form-label">Nombre de voyageurs</label>
                        <input type="number" className="form-control" id="travelerCount" value={travelerCount} onChange={e => setTravelerCount(parseInt(e.target.value))} min="1" />
                    </div>
                    <button className="btn btn-primary w-100 btn-lg" onClick={handleBooking}>Continuer</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProgramDetail;