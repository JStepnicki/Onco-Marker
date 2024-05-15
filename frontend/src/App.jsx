import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DoctorPage from './pages/DoctorPage';
import Navbar from './components/Header/Navbar';
import Register from './components/Auth/Register';
import PatientPage from './pages/PatienPage';
import ResultsPage from './pages/ResultsPage';
import ErrorPage from './pages/ErrorPage';
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
          <Route path='/patients/:id' element={<PatientPage/>}/>
          <Route path='/patients/:id/results' element={<ResultsPage/>}/>
          <Route path='/error' element={<ErrorPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;