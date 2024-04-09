import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DoctorPage from './pages/DoctorPage';
import Navbar from './components/Header/Navbar';
import Register from './components/Auth/Register';
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/doctors" element={<DoctorPage/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;