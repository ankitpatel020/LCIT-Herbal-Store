import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNav = () => {
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Reviews', path: '/admin/reviews' },
        { name: 'Coupons', path: '/admin/coupons' },
    ];

    return (
        <div className="bg-white shadow-sm border-b mb-8 sticky top-20 z-40">
            <div className="container-custom">
                <div className="py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-display font-bold text-gray-900">Admin Portal</h2>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Department of Science</p>
                    </div>
                    <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                        Authorized Personnel Only
                    </div>
                </div>
                <div className="flex space-x-1 overflow-x-auto py-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `py-2 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isActive
                                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminNav;
