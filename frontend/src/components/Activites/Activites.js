import React from 'react';

const activities = [
  {
    id: 1,
    title: 'Boating (Balade en bateau)',
    description: 'Profitez d\'une excursion relaxante sur l\'eau. Que ce soit sur un lac serein ou le long de la côte, nos balades en bateau offrent des vues spectaculaires et un moment de détente inoubliable.',
    image: 'https://images.unsplash.com/photo-1516496791193-629e4a7f435b?q=80&w=2070&auto=format&fit=crop' // Placeholder image
  },
  {
    id: 2,
    title: 'City Tour (Visite de la ville)',
    description: 'Découvrez les secrets les mieux gardés de nos destinations avec un guide local expert. Explorez les monuments historiques, les marchés animés et la culture authentique de chaque ville.',
    image: 'https://images.unsplash.com/photo-1569926333394-21686c5132a2?q=80&w=2070&auto=format&fit=crop' // Placeholder image
  }
];

function Activites() {
  return (
    <div>
      <h1 className="text-center mb-5">Les Activités Proposées</h1>
      <div className="row g-4">
        {activities.map(activity => (
          <div key={activity.id} className="col-md-6">
            <div className="card h-100 shadow-sm">
              <img src={activity.image} className="card-img-top" alt={activity.title} style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{activity.title}</h5>
                <p className="card-text">{activity.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activites;