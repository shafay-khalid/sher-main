import React from 'react';
import Login from '../pages/Auth/Login';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function PrivateRoutes({ Component, allowedRoles }) {
    const { state } = useAuth();
    // console.log(state)

    if (!state.isAuthenticated) return <Login />

    if (allowedRoles && !allowedRoles.includes(state.user.role)) {
        return <Navigate to='dashboard' />;
    }

    return <Component />;
}