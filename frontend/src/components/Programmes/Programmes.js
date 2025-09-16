import React from 'react';
import { programsData } from '../../data';
import ProgramCard from '../ProgramCard/ProgramCard';

function Programmes() {
  const nationalPrograms = programsData.filter(p => p.category === 'national');
  const internationalPrograms = programsData.filter(p => p.category === 'international');

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
