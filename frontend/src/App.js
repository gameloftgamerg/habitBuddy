import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import Register from './Register';
import Login from './Login';
import Navbar from './Navbar'; 
import ForgotPassword from './ForgotPassword'; 

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <Router>
            <Navbar /> 
            <Routes>
                <Route path="/register" element={<Register setToken={setToken} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/home" element={<MainPage token={token} setToken={setToken} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
};

export default App;
