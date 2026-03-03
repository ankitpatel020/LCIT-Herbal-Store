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
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">

            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="container-custom py-4 flex justify-between items-center">

                    <div>
                        <h2 className="text-lg font-bold tracking-wide">
                            Admin Portal
                        </h2>
                        <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">
                            Department of Chemistry
                        </p>
                    </div>

                    <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Authorized Access
                    </div>

                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="container-custom">

                <div className="flex gap-2 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-gray-300">

                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative px-5 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${isActive
                                    ? 'text-white bg-emerald-600 shadow-lg shadow-emerald-600/30'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
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