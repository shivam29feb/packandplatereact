import React, { useState } from 'react';
import './AddUser.module.css';

const AddUser: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('User added:', { name, email, password });
    };

    return (
        <div>
            <h2>Add New User</h2>
            <form method="post" action="" onSubmit={handleSubmit}>
                <label htmlFor="name">Username:</label>
                <input
                    type="text"
                    id="name"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input type="submit" value="Add User" />
            </form>
        </div>
    );
};

export default AddUser;