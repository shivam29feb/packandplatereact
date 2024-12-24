import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/pages/public/Home/Home';
import Contact from '../components/pages/public/Contact/Contact';
import About from '../components/pages/public/About/About';
import AddDish from '../components/pages/member-only/dishes/AddDish/AddDish';
import EditDish from '../components/pages/member-only/dishes/EditDish/EditDish';
import ViewDish from '../components/pages/member-only/dishes/ViewDish/ViewDish';
import Signup from '../components/pages/public/Signup/Signup';
import Login from '../components/pages/public/Login/Login';
import AdminLogin from '../components/pages/public/AdminLogin/AdminLogin';
import AdminSignup from '../components/pages/public/AdminSignup/AdminSignup';
 

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/add-dish" element={<AddDish />} />
      <Route path="/edit-dish/:id" element={<EditDish />} />
      <Route path="/view-dish/:id" element={<ViewDish />} />
      
    </Routes>
  );
};

export default AppRoutes;
