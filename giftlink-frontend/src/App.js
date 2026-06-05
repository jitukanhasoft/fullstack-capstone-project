import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import SearchPage from './components/SearchPage/SearchPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {

  return (
    <>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/search" element={<SearchPage />} />
          <Route path="/app/product/:productId" element={<DetailsPage />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/login" element={<Login />} />
          <Route path="/app/register" element={<Register />} />
        </Routes>
    </>
  );
}

export default App;
