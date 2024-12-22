import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ...existing code...

const AddDish = () => {
    const [dish, setDish] = useState({ name: '', description: '', price: 0 });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDish({ ...dish, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to save the dish
        // After saving, navigate to the dishes list or another appropriate page
        navigate('/dishes');
    };

    return (
        <div>
            <h2>Add Dish</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={dish.name} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={dish.description} onChange={handleChange} />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={dish.price} onChange={handleChange} />
                </label>
                <button type="submit">Add Dish</button>
            </form>
        </div>
    );
};

export default AddDish;
