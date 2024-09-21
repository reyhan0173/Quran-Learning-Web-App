import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
    const accessToken = localStorage.getItem('accessToken');
    const userGroup = localStorage.getItem('userGroup');

    if (!accessToken || !allowedRoles.includes(userGroup)) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;
