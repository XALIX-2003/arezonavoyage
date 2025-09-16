import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { programsData } from '../../data';
import ProgramCard from '../ProgramCard/ProgramCard';

function Home() {
  const featuredPrograms = programsData.slice(0, 3);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-content text-center text-white">
          <h1 className="display-4 fw-bold">Votre aventure sur mesure commence ici</h1>
          <p className="lead">Découvrez des destinations uniques avec AREZONA VOYAGE</p>
          <Link to="/programmes" className="btn btn-primary btn-lg mt-3">Voir nos programmes</Link>
        </div>
      </section>

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
