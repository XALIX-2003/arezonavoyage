import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Programmes from './components/Programmes/Programmes';
import Activites from './components/Activites/Activites';
import Hotels from './components/Hotels/Hotels';
import About from './components/About/About';
import ProgramDetail from './components/ProgramDetail/ProgramDetail';
import BookingForm from './components/BookingForm/BookingForm';
import ThankYou from './components/ThankYou/ThankYou';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/programmes/:id" element={<ProgramDetail />} />
            <Route path="/activites" element={<Activites />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;