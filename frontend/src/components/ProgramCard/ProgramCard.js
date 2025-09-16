import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProgramCard.css';

function ProgramCard({ program }) {
  const { id, title, destination, duration, price, image, images } = program;
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="card program-card h-100 shadow-sm">
      {images && images.length > 1 ? (
        <div className="program-carousel">
          <img src={images[currentImg]} className="card-img-top" alt={title} />
          <div className="carousel-controls">
            <button
              className="carousel-btn"
              onClick={() => setCurrentImg((currentImg - 1 + images.length) % images.length)}
              aria-label="Image précédente"
            >&#8592;</button>
            <span className="carousel-indicator">{currentImg + 1}/{images.length}</span>
            <button
              className="carousel-btn"
              onClick={() => setCurrentImg((currentImg + 1) % images.length)}
              aria-label="Image suivante"
            >&#8594;</button>
          </div>
        </div>
      ) : (
        <img src={image} className="card-img-top" alt={title} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">{destination}</p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span>{duration}</span>
            <span className="fs-5 fw-bold">{price} €</span>
          </div>
          <Link to={`/programmes/${id}`} className="btn btn-primary w-100">Voir le programme</Link>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
