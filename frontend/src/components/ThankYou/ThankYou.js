import React from 'react';
import { Link } from 'react-router-dom';

function ThankYou() {
  const phoneNumber = '0654228224';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\s/g, '')}`;

  return (
    <div className="text-center py-5">
      <h1 className="display-4">Merci !</h1>
      <p className="lead">Votre demande de réservation a bien été prise en compte.</p>
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
