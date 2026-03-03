import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiInstagram as Instagram,
    FiFacebook as Facebook,
    FiLinkedin as Linkedin,
    FiMail as Mail,
    FiPhone as Phone,
    FiMapPin as MapPin
} from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-b from-emerald-950 via-gray-950 to-black text-white pt-20 pb-10 border-t border-emerald-800/30 overflow-hidden print:hidden">

            {/* Glow Effect Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-14 mb-16">

                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition">
                                <img
                                    src="/assets/lcit-herbal-store-logo.jpg"
                                    alt="LCIT Herbal"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                LCIT <span className="text-emerald-400">Herbal</span>
                            </span>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Student-powered herbal innovation blending traditional
                            Ayurvedic wisdom with modern chemistry excellence.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-all hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6 text-emerald-400">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/shop" className="hover:text-white transition">Shop Products</Link></li>
                            <li><Link to="/about" className="hover:text-white transition">About Department</Link></li>
                            <li><Link to="/help-center" className="hover:text-white transition">Help Center</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Discover */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6 text-emerald-400">
                            Discover
                        </h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link to="/shop" className="hover:text-white transition">New Arrivals</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition">Top Rated</Link></li>
                            <li><Link to="/about" className="hover:text-white transition">Student Innovation</Link></li>
                            <li><Link to="/manufacturing" className="hover:text-white transition">Lab Process</Link></li>
                        </ul>
                    </div>

                    {/* Contact + Newsletter */}
                    <div>
                        <h3 className="font-semibold text-lg mb-6 text-emerald-400">
                            Stay Connected
                        </h3>

                        <div className="space-y-4 text-gray-400 text-sm mb-6">
                            <div className="flex gap-3">
                                <MapPin size={16} />
                                <span>Bodri, Bilaspur (C.G.) - 495001</span>
                            </div>
                            <div className="flex gap-3">
                                <Mail size={16} />
                                <span>lcitherbal@college.edu</span>
                            </div>
                            <div className="flex gap-3">
                                <Phone size={16} />
                                <span>+91 7752-000000</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>
                        © {new Date().getFullYear()} LCIT Herbal Store. Crafted with 🌿 by LCIT Students.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;