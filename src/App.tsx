import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/pages/HomePage';

// Define a new Header component
const Header: React.FC<{ title: string }> = ({ title }) => (
  <header>
    <h1>{title}</h1>
  </header>
);

const App: React.FC = () => {
  return (
    <Router>
      <Header title="Hello, world!" />
      <Switch>
        <Route path="/" exact component={HomePage} />
        {/* Add more routes as needed */}
      </Switch>
    </Router>
  );
};

export default App;
