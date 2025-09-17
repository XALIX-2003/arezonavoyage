import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { programsData } from '../../data';
import ProgramCard from '../ProgramCard/ProgramCard';
import Calendar from '../Calendar/Calendar';

const heroImages = programsData.map(p => p.image);

function Home() {
  const featuredPrograms = programsData.slice(0, 3);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedProgramId && selectedDate) {
      const selectedProgram = programsData.find(p => p.id === parseInt(selectedProgramId));
      navigate('/booking', { 
        state: { 
          program: selectedProgram, 
          selectedDate: `${selectedDate.day}/${selectedDate.month + 1}/${selectedDate.year}`,
          travelerCount: 1
        }
      });
    } else if (selectedProgramId) {
      navigate(`/programmes/${selectedProgramId}`);
    }
  };

  const handleDestinationChange = (e) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);
    setSelectedDate(null); // Reset date when destination changes
    if (programId) {
      const program = programsData.find(p => p.id === parseInt(programId));
      setSelectedMonth(Object.keys(program.availability)[0]);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const selectedProgram = selectedProgramId ? programsData.find(p => p.id === parseInt(selectedProgramId)) : null;

  return (
    <div>
      <section className="hero-section" style={{backgroundImage: `url(${heroImages[currentImageIndex]})`}}>
        <div className="hero-content text-center text-white">
          <Link to="/programmes" className="btn btn-primary btn-lg mt-3">Voir nos programmes</Link>
        </div>
      </section>

      <section className="search-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <form className="search-form p-4 rounded shadow-sm bg-white" onSubmit={handleSearch}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label htmlFor="destination" className="form-label fw-bold">Destination</label>
                    <div className="input-group">
                      <select className="form-select" id="destination" value={selectedProgramId} onChange={handleDestinationChange}>
                        <option value="">Choisissez une destination</option>
                        {programsData.map(program => (
                          <option key={program.id} value={program.id}>{program.title}</option>
                        ))}
                      </select>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button" 
                        onClick={() => setShowCalendar(true)} 
                        disabled={!selectedProgramId}>
                        📅
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100" disabled={!selectedProgramId || !selectedDate}>
                      {selectedDate ? 'Réserver' : 'Rechercher'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showCalendar && selectedProgram && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Disponibilité pour {selectedProgram.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCalendar(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="monthSelect" className="form-label">Choisissez un mois</label>
                  <select className="form-select" id="monthSelect" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                    {Object.keys(selectedProgram.availability).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <Calendar 
                  availability={selectedProgram.availability} 
                  selectedMonth={selectedMonth} 
                  onDateSelect={handleDateSelect} 
                  selectedDate={selectedDate} />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="container my-5">
        <h2 className="text-center mb-4">Nos programmes populaires</h2>
        <div className="row">
          {featuredPrograms.map(program => (
            <div key={program.id} className="col-lg-4 col-md-6 mb-4">
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
        <div className="text-center">
            <Link to="/programmes" className="btn btn-outline-primary mt-3">Voir tous les programmes</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
