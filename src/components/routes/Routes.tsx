import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DishesRoutes from '../pages/member-only/dishes/routes';
// ...import other components...

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dishes/*" element={<DishesRoutes />} />
                {/* ...other routes... */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
