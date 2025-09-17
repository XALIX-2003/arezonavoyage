import React from 'react';
import { useLocation } from 'react-router-dom';
import { programsData } from '../../data';
import ProgramCard from '../ProgramCard/ProgramCard';

function Programmes() {
  const location = useLocation();
  const filteredPrograms = location.state?.filteredPrograms;

  const nationalPrograms = programsData.filter(p => p.category === 'national');
  const internationalPrograms = programsData.filter(p => p.category === 'international');

  if (filteredPrograms) {
    return (
      <div>
        <h2 className="text-center mb-4">Résultats de la recherche</h2>
        <div className="row">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map(program => (
              <div key={program.id} className="col-lg-4 col-md-6 mb-4">
                <ProgramCard program={program} />
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Aucun programme ne correspond à votre recherche.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-center mb-4">Programmes Nationaux</h2>
        <div className="row">
          {nationalPrograms.length > 0 ? (
            nationalPrograms.map(program => (
              <div key={program.id} className="col-lg-4 col-md-6 mb-4">
                <ProgramCard program={program} />
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Aucun programme national disponible pour le moment.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-center mb-4">Programmes Internationaux</h2>
        <div className="row">
          {internationalPrograms.length > 0 ? (
            internationalPrograms.map(program => (
              <div key={program.id} className="col-lg-4 col-md-6 mb-4">
                <ProgramCard program={program} />
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Nos offres pour l'international seront bientôt disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Programmes;
