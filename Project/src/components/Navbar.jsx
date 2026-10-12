import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <div className="brand-icon">💧</div>
          <div>
            <div className="brand-title">Edmonds–Karp Flow</div>
            <div className="brand-subtitle">Water Network • DSA 3</div>
          </div>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/workbench"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Network Workbench
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/simulation"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Simulation
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/results"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Results Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/algorithm"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Algorithm Theory
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/team"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              Project Team
            </NavLink>
          </li>
          <li>
            <Link
              to="/simulation"
              state={{ autoPlay: true }}
              className="nav-link nav-cta-btn"
              onClick={closeMobileMenu}
            >
              Start Simulation
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
