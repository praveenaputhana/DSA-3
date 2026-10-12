import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Workbench from './pages/Workbench';
import Simulation from './pages/Simulation';
import Results from './pages/Results';
import Algorithm from './pages/Algorithm';
import Team from './pages/Team';
import NotFound from './pages/NotFound';

export default function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workbench" element={<Workbench showToast={showToast} />} />
          <Route path="/simulation" element={<Simulation showToast={showToast} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/algorithm" element={<Algorithm />} />
          <Route path="/team" element={<Team />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
