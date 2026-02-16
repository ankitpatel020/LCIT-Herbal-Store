import React from 'react';
import AdminLayout from './admin/AdminLayout';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
};

export default AdminRoute;
