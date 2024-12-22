// src/components/EditDish/EditDish.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDish, updateDish } from '../../api/dishes';

const EditDish = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchDish = async () => {
      const fetchedDish = await getDish(id);
      setDish(fetchedDish);
      setName(fetchedDish.name);
      setDescription(fetchedDish.description);
      setPrice(fetchedDish.price);
    };

    fetchDish();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDish = { ...dish, name, description, price };
    await updateDish(id, updatedDish);
  };

  return (
    <div>
      <h2>Edit Dish</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditDish;
