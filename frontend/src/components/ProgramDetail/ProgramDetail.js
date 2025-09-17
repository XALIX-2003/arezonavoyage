import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programsData } from '../../data';
import Calendar from '../Calendar/Calendar';
import './ProgramDetail.css';

function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = programsData.find(p => p.id === parseInt(id));

  const [selectedDate, setSelectedDate] = useState(program ? program.availableDates[0] : '');
  const [travelerCount, setTravelerCount] = useState(1);
  const [activeTab, setActiveTab] = useState('program');
  const [selectedMonth, setSelectedMonth] = useState(program ? Object.keys(program.availability)[0] : '');
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (program && program.images && program.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImg((prevImg) => (prevImg + 1) % program.images.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(timer);
    }
  }, [program]);

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
                <div className="program-detail-image-wrapper mb-4">
                  {program.images && program.images.length > 1 ? (
                    <div className="program-carousel">
                      <img src={program.images[currentImg]} className="img-fluid rounded" alt={program.title} />
                      <div className="carousel-controls">
                        <button
                          className="carousel-btn"
                          onClick={() => setCurrentImg((currentImg - 1 + program.images.length) % program.images.length)}
                          aria-label="Image précédente"
                        >&#8592;</button>
                        <span className="carousel-indicator">{currentImg + 1}/{program.images.length}</span>
                        <button
                          className="carousel-btn"
                          onClick={() => setCurrentImg((currentImg + 1) % program.images.length)}
                          aria-label="Image suivante"
                        >&#8594;</button>
                      </div>
                    </div>
                  ) : (
                    <img src={program.image} alt={program.title} className="img-fluid rounded" />
                  )}
                </div>
                
                <h1 className="mb-3">{program.title}</h1>
                <p className="lead text-muted">{program.destination}</p>
                <hr />

                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'program' ? 'active' : ''}`} onClick={() => setActiveTab('program')}>Programme</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Disponibilités</button>
                  </li>
                </ul>

                {activeTab === 'program' && (
                  <div className="timeline">
                      {program.details.map((dayDetail, index) => (
                          <div className="timeline-item" key={index}>
                              <div className="timeline-marker">Jour {dayDetail.day}</div>
                              <div className="timeline-content card shadow-sm mb-3">
                                  <div className="card-body">
                                      <h5 className="card-title">{dayDetail.title}</h5>
                                      <ul className="card-text">
                                          {dayDetail.description.split('. ').map((sentence, i) => (
                                              sentence && <li key={i}>{sentence}</li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                )}

                {activeTab === 'calendar' && (
                  <div>
                    <div className="mb-3">
                      <label htmlFor="monthSelect" className="form-label">Choisissez un mois</label>
                      <select className="form-select" id="monthSelect" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                        {Object.keys(program.availability).map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <Calendar availability={program.availability} selectedMonth={selectedMonth} />
                  </div>
                )}

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