import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import AppRoutes from './components/routes/Routes';
// import Dishes from './components/pages/member-only/dishes';
import AddDish from './components/pages/member-only/dishes/AddDish/AddDish';
import EditDish from './components/pages/member-only/dishes/EditDish/EditDish';
import ViewDish from './components/pages/member-only/dishes/ViewDish/ViewDish';

// Define a new Header component
const Header: React.FC<{ title: string }> = ({ title }) => (
  <header>
    <h1>{title}</h1>
  </header>
);

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
};

export default App;
