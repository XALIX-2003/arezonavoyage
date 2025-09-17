import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

function ThankYou() {
  const phoneNumber = '0654228224'; // Replace with actual WhatsApp number
  const whatsappMessage = 'Bonjour, je souhaite confirmer ma réservation.'; // Pre-filled message
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="text-center py-5">
      <img src={logo} alt="Arezona Voyage Logo" className="mb-4" style={{ maxWidth: '150px' }} />
      <h1 className="display-4">Merci !</h1>
      <p className="lead">Vos informations ont été soumises avec succès via le formulaire Google.</p>
      <p>Un de nos agents vous contactera sous peu. Pour confirmer votre réservation immédiatement, veuillez nous contacter :</p>
      <div className="mt-4">
        <p className="fs-5">
            <strong>Téléphone:</strong> {phoneNumber}
        </p>
        <a href={whatsappLink} className="btn btn-success btn-lg" target="_blank" rel="noopener noreferrer">
            Confirmer sur WhatsApp
        </a>
      </div>
      <div className="mt-5">
        <Link to="/" className="btn btn-outline-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

export default ThankYou;
