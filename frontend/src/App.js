// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Navbar from './Navbar'; 
import ForgotPassword from './ForgotPassword'; 

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/register" element={<Register setToken={setToken} setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/login" element={<Login setToken={setToken} setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/" element={<MainPage token={token} isLoggedIn={isLoggedIn} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/logout" element={<Logout setToken={setToken} setIsLoggedIn={setIsLoggedIn}/>} />
            </Routes>
        </Router>
    );
};

export default App;


