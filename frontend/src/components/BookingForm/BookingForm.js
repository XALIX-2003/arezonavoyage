import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { program, selectedDate, travelerCount } = location.state || {};

  const [travelers, setTravelers] = useState(Array.from({ length: travelerCount || 0 }, () => ({ nom: '', prenom: '', email: '', telephone: '', ville: '' })));
  const [specificRequest, setSpecificRequest] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (index, event) => {
    const newTravelers = [...travelers];
    newTravelers[index][event.target.name] = event.target.value;
    setTravelers(newTravelers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const bookingData = {
      programTitle: program.title,
      selectedDate,
      travelers,
      specificRequest,
      price: program.price ? parseFloat(program.price) : null
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue lors de la réservation.');
      }

      navigate('/thank-you');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!program) {
    return (
      <div className="text-center">
        <h2>Information de réservation manquante</h2>
        <p>Veuillez recommencer le processus de réservation.</p>
        <button onClick={() => navigate('/programmes')} className="btn btn-primary">Voir les programmes</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Complétez votre réservation</h1>
      <div className="card bg-light mb-4">
        <div className="card-body">
          <h5 className="card-title">Votre sélection</h5>
          <p className="card-text"><strong>Programme:</strong> {program.title}</p>
          <p className="card-text"><strong>Date:</strong> {selectedDate}</p>
          <p className="card-text"><strong>Voyageurs:</strong> {travelerCount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {Array.from({ length: travelerCount || 0 }, (_, i) => i).map(index => (
          <div key={index} className="card mb-3">
            <div className="card-header">Voyageur {index + 1}</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor={`nom-${index}`} className="form-label">Nom</label>
                  <input type="text" id={`nom-${index}`} name="nom" className="form-control" required onChange={(e) => handleInputChange(index, e)} value={travelers[index].nom} />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`prenom-${index}`} className="form-label">Prénom</label>
                  <input type="text" id={`prenom-${index}`} name="prenom" className="form-control" required onChange={(e) => handleInputChange(index, e)} value={travelers[index].prenom} />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`email-${index}`} className="form-label">Email</label>
                  <input type="email" id={`email-${index}`} name="email" className="form-control" required onChange={(e) => handleInputChange(index, e)} value={travelers[index].email} />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`telephone-${index}`} className="form-label">Téléphone</label>
                  <input type="tel" id={`telephone-${index}`} name="telephone" className="form-control" required onChange={(e) => handleInputChange(index, e)} value={travelers[index].telephone} />
                </div>
                <div className="col-md-12">
                  <label htmlFor={`ville-${index}`} className="form-label">Ville</label>
                  <input type="text" id={`ville-${index}`} name="ville" className="form-control" required onChange={(e) => handleInputChange(index, e)} value={travelers[index].ville} />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="card mb-3">
            <div className="card-header">Demande spécifique</div>
            <div className="card-body">
                <textarea 
                    className="form-control" 
                    id="specificRequest"
                    rows="4"
                    placeholder="Avez-vous des allergies, des besoins particuliers ou d'autres questions ?"
                    value={specificRequest}
                    onChange={e => setSpecificRequest(e.target.value)}
                ></textarea>
            </div>
        </div>
        
        {error && (
          <div className="alert alert-danger mt-3">
            <strong>Erreur :</strong> {error}
          </div>
        )}
        
        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Confirmation en cours...' : 'Confirmer la réservation'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;