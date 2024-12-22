
import React from 'react';
import Button from '../atoms/Button';

interface CardProps {
  title: string;
  content: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, content, buttonLabel, onButtonClick }) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
      <Button label={buttonLabel} onClick={onButtonClick} />
    </div>
  );
};

export default Card;