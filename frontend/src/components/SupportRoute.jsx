import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SupportRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!['admin', 'agent', 'support'].includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default SupportRoute;
