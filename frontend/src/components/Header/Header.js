import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import './Header.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Arezona Voyage Logo" height="80" />
          <strong className="ms-2" style={{ color: 'var(--primary-color)' }}>AREZONA VOYAGE</strong>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">HOME</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/programmes">PROGRAMMES</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/activites">ACTIVITÉS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/hotels">HÔTELS</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">ABOUT US</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;