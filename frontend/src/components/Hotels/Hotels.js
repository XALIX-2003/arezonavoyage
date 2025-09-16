import React from 'react';

const hotels = [
  {
    id: 1,
    name: 'Riad El Fenn',
    location: 'Marrakech',
    description: 'Un riad de luxe au cœur de la Médina, offrant une expérience authentique avec une touche de modernité. Profitez de sa piscine sur le toit et de ses cours intérieures luxuriantes.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' // Placeholder
  },
  {
    id: 2,
    name: 'La Mamounia',
    location: 'Marrakech',
    description: 'Palace iconique de Marrakech, connu pour ses jardins somptueux, son spa de renommée mondiale et son service impeccable. Une destination en soi.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?q=80&w=2070&auto=format&fit=crop' // Placeholder
  },
  {
    id: 3,
    name: 'Heure Bleue Palais',
    location: 'Essaouira',
    description: 'Ancien palais transformé en hôtel de luxe, offrant une vue imprenable sur l\'océan et la médina. Une oasis de paix et de raffinement.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop' // Placeholder
  },
    {
    id: 4,
    name: 'Riad Fès',
    location: 'Fès',
    description: 'Un joyau de l\'architecture hispano-mauresque, ce Riad vous transporte dans le temps avec ses zelliges, ses boiseries sculptées et son patio majestueux.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' // Placeholder
  }
];

function Hotels() {
  return (
    <div>
      <h1 className="text-center mb-5">Nos Hôtels Partenaires</h1>
      <p className="text-center text-muted mb-5">Nous sélectionnons avec soin des hôtels et riads de charme pour garantir votre confort durant votre séjour.</p>
      <div className="row g-4">
        {hotels.map(hotel => (
          <div key={hotel.id} className="col-md-6">
            <div className="card h-100 shadow-sm">
              <img src={hotel.image} className="card-img-top" alt={hotel.name} style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{hotel.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
                <p className="card-text">{hotel.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;