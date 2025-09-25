import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ProgramCard from '../ProgramCard/ProgramCard';
import { getProgrammes, getDestinations } from '../../api';

function Home() {
  const [allProgrammes, setAllProgrammes] = useState([]); // Store all programs
  const [displayedProgrammes, setDisplayedProgrammes] = useState([]); // Programs to display
  const [destinations, setDestinations] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [selectedDate, setSelectedDate] = useState('');
  const [destinationNames, setDestinationNames] = useState([]); // New state for unique destination names
  const BACKEND_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programmesData, destinationsData] = await Promise.all([
            getProgrammes(),
            getDestinations()
        ]);

        setAllProgrammes(programmesData);
        setDisplayedProgrammes(programmesData);
        setDestinations(destinationsData);

        const uniqueDestinationNames = [...new Set(programmesData.map(prog => prog.destination_name))].filter(Boolean);
        setDestinationNames(uniqueDestinationNames);

        let combinedImages = [];
        combinedImages = combinedImages.concat(programmesData.map(prog => prog.image).filter(Boolean));
        destinationsData.forEach(dest => {
          if (dest.images && Array.isArray(dest.images)) {
            combinedImages = combinedImages.concat(dest.images);
          }
        });
        
        const uniqueCombinedImages = [...new Set(combinedImages)];
        const shuffledImages = uniqueCombinedImages.sort(() => 0.5 - Math.random());
        
        setHeroImages(shuffledImages.length > 0 ? shuffledImages : [`${BACKEND_URL}/uploads/placeholder.png`]);

      } catch (error) {
        console.error("Error fetching data:", error);
        setHeroImages([`${BACKEND_URL}/uploads/placeholder.png`]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = allProgrammes.filter(prog => {
      const matchesSearchTerm = !searchTerm || 
                                (prog.destination_name && prog.destination_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (prog.title && prog.title.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDate = !selectedDate || (prog.available_dates && prog.available_dates.includes(selectedDate));
      return matchesSearchTerm && matchesDate;
    });
    setDisplayedProgrammes(filtered);
  }, [searchTerm, selectedDate, allProgrammes]);


  const featuredProgrammes = displayedProgrammes.slice(0, 3);

  return (
    <div>
      <section className="hero-section">
        {loading ? (
          <div className="hero-content text-center"><h2>Loading...</h2></div>
        ) : (
          <div id="homeHeroCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#homeHeroCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
            <div className="carousel-inner">
              {heroImages.map((imgUrl, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="hero-image" style={{backgroundImage: `url(${BACKEND_URL}${imgUrl})`}}></div>
                  <div className="hero-content text-center text-white">
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#homeHeroCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeHeroCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}
      </section>

      <section className="search-section py-5 text-center">
        <div className="container">
            <h2 className="mb-4">Find Your Perfect Programme</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by destination or program name..."
                            list="destination-suggestions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <datalist id="destination-suggestions">
                            {destinationNames.map((name, index) => (
                                <option key={index} value={name} />
                            ))}
                        </datalist>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                        />
                    </div>
                </div>
            </div>
            <p className="lead">Or explore all our programmes below.</p>
            <Link to="/programmes" className="btn btn-orange btn-lg">View All Programmes</Link>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-4">Our Destinations</h2>
        <div className="row">
          {destinations.map(dest => (
            <div key={dest.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                    <img src={`${BACKEND_URL}${dest.image}`} className="card-img-top" alt={dest.name} />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{dest.name}</h5>
                        <p className="card-text text-muted">{dest.description?.substring(0, 120)}...</p>
                        <div className="mt-auto">
                            <Link to={`/destinations/${dest.id}`} className="btn btn-primary w-100">View Destination</Link>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center mb-4">Popular Programmes</h2>
        <div className="row">
          {displayedProgrammes.length > 0 ? (
            displayedProgrammes.slice(0, 3).map(prog => (
              <div key={prog.id} className="col-lg-4 col-md-6 mb-4">
                <ProgramCard program={prog} />
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No programmes found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
