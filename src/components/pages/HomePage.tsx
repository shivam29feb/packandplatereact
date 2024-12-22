
import React from 'react';
import MainTemplate from '../templates/MainTemplate';
import Card from '../molecules/Card';

const HomePage: React.FC = () => {
  const handleButtonClick = () => {
    console.log('Button clicked');
  };

  return (
    <MainTemplate>
      <Card
        title="Welcome to Pack and Plate"
        content="This is the home page."
        buttonLabel="Click Me"
        onButtonClick={handleButtonClick}
      />
    </MainTemplate>
  );
};

export default HomePage;