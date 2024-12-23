import React, { useState } from 'react';

const EditDish = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  interface DishForm {
    name: string;
    description: string;
    price: string;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <h2>Edit Dish</h2>
      <form method="post" action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dish_name">Dish Name:</label>
          <input
        type="text"
        id="dish_name"
        name="dish_name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
          />
        </div>
        <br />
        <div>
          <label htmlFor="price">Price:</label>
          <input
        type="number"
        id="price"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
          />
        </div>
        <br />
        <input type="submit" value="Update Dish" />
      </form>
    </div>
  );
};

export default EditDish;
