import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import AddDish from './AddDish/AddDish';
import EditDish from './EditDish/EditDish';
import ViewDish from './ViewDish/ViewDish';

const DishesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Outlet />}>
                <Route path="add" element={<AddDish />} />
                <Route path="edit/:id" element={<EditDish />} />
                <Route path="view/:id" element={<ViewDish />} />
            </Route>
        </Routes>
    );
};

export default DishesRoutes;
