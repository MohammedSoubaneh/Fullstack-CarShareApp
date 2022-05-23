import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { Home } from './components/Home'
import { Login } from './components/Login';
import { RegistrationForm } from './components/Register';

export const MyApp = () => {

  return (
    <Router>
      <div id="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </div>
    </Router>
  );
}
