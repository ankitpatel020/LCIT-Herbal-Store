import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-green-800 print:hidden">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-display font-bold text-white mb-4 block">
                            LCIT <span className="text-green-400">Herbal</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            A student-driven initiative by the Department of Science, blending traditional knowledge with modern pharmaceutical practices.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons Placeholders */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-sm">IG</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-sm">FB</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-sm">LN</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-green-400">Quick Links</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/shop" className="hover:text-white transition-colors">Shop Products</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Department</Link></li>
                            <li><Link to="/help-center" className="hover:text-white transition-colors">Help & Center</Link></li>
                            <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Discover */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-green-400">Discover</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Top Rated</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Student Innovation</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">Lab Reports</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-green-400">Visit Us</h3>
                        <address className="not-italic text-gray-400 space-y-4 text-sm">
                            <p>
                                <strong className="text-white block mb-1">Department of Science</strong>
                                LCIT College of Commerce & Science,<br />
                                Bodri, Bilaspur (C.G.) - 495001
                            </p>
                            <p>
                                <strong className="text-white block mb-1">Email</strong>
                                science.dept@lcit.edu.in
                            </p>
                            <p>
                                <strong className="text-white block mb-1">Phone</strong>
                                +91 7752-000000
                            </p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} LCIT Herbal Store. Developed by Students of LCIT. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
