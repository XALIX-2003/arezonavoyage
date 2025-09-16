import React from 'react';
import { Facebook, Instagram, Linkedin } from 'react-bootstrap-icons';

function About() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="text-center mb-5">
            <h1>À Propos d'AREZONA VOYAGE</h1>
            <p className="lead text-muted">Votre créateur d'expériences sur mesure au Maroc.</p>
          </div>

          <div>
            <h3>Notre Mission</h3>
            <p>
              Chez AREZONA VOYAGE, notre passion est de vous faire découvrir le Maroc authentique, loin des sentiers battus. Nous croyons que le voyage est une opportunité de créer des souvenirs inoubliables, de s'immerger dans une nouvelle culture et de se connecter avec la nature et les gens. Notre mission est de concevoir des itinéraires personnalisés qui répondent à vos envies d'aventure, de détente et de découverte.
            </p>
          </div>

          <hr className="my-5" />

          <div className="text-center">
            <h3>Notre Équipe</h3>
            <p className="text-muted mb-4">Des passionnés à votre service</p>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Jean Dupont</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Fondateur & Expert Destination</h6>
                    <p className="card-text">Avec plus de 15 ans d'expérience dans le tourisme au Maroc, Jean met sa passion et sa connaissance approfondie du terrain au service de vos rêves d'évasion.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Fatima Rossi</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Responsable des Opérations</h6>
                    <p className="card-text">Fatima s'assure que chaque détail de votre voyage est parfaitement orchestré, de la réservation de votre riad à l'organisation de vos activités.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-5" />

          <div className="text-center">
            <h3>Suivez-nous</h3>
            <p className="text-muted mb-4">Restez connectés avec nous sur les réseaux sociaux</p>
            <div>
              <a href="#" className="text-dark mx-3 fs-3"><Facebook /></a>
              <a href="#" className="text-dark mx-3 fs-3"><Instagram /></a>
              <a href="#" className="text-dark mx-3 fs-3"><Linkedin /></a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default About;