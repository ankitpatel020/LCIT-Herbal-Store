import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getFAQs } from '../store/slices/faqSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiChevronDown, FiChevronUp, FiSearch, FiMessageSquare, FiPhone, FiMail, FiMapPin, FiBox, FiCreditCard, FiTruck } from 'react-icons/fi';

const FAQItem = ({ faq, isOpen, onClick }) => (
    <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <button
            className="w-full px-6 py-5 flex items-center justify-between bg-white focus:outline-none"
            onClick={onClick}
        >
            <span className="font-semibold text-gray-800 text-left pr-4">{faq.question}</span>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const HelpCenter = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { faqs, isLoading } = useSelector((state) => state.faqs);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        dispatch(getFAQs());
    }, [dispatch]);

    const handleChatClick = () => {
        if (!user) {
            toast.error('Please login to chat with support');
            navigate('/login');
            return;
        }

        // If staff member, take them to the Inbox
        if (['admin', 'agent', 'support'].includes(user.role)) {
            navigate('/support/chat');
            return;
        }

        window.dispatchEvent(new CustomEvent('open-support-chat'));
    };

    const categories = [
        { icon: FiBox, title: "Orders", desc: "Tracking, returns, cancellations" },
        { icon: FiCreditCard, title: "Payments", desc: "COD, UPI, refunds" },
        { icon: FiTruck, title: "Delivery", desc: "Shipping policies, delays" },
        { icon: FiMessageSquare, title: "General", desc: "Account setup, profile" }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-emerald-800 pt-20 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-emerald-700 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-emerald-900 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
                </div>

                <div className="max-w-3xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                    >
                        How can we help you today?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-emerald-100 text-lg mb-10"
                    >
                        Search our knowledge base or browse categories below to find answers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Type your question here..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 text-lg transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {categories.map((cat, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            key={idx}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                <cat.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                            <p className="text-gray-500 text-sm">{cat.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
                                <p className="text-gray-500 mt-2">Find quick answers to common queries</p>
                            </div>
                        </div>

                        {filteredFaqs.length > 0 ? (
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, idx) => (
                                    <FAQItem
                                        key={idx}
                                        faq={faq}
                                        isOpen={openIndex === idx}
                                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-2xl text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiSearch size={28} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500">We couldn't find any articles matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>

                    {/* Contact Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Need more help?</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiPhone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Call Us</h4>
                                        <p className="text-sm text-gray-500 mb-1">Mon-Sat from 9am to 6pm</p>
                                        <a href="tel:+917752000000" className="text-blue-600 font-medium hover:underline">+91 7752-000000</a>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Email Us</h4>
                                        <p className="text-sm text-gray-500 mb-1">Our team replies within 24 hrs</p>
                                        <a href="mailto:lcitherbal@college.edu" className="text-emerald-600 font-medium hover:underline">lcitherbal@college.edu</a>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Visit Us</h4>
                                        <p className="text-sm text-gray-500">LCIT Campus, Bodri,<br />Bilaspur (C.G.) - 495001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleChatClick}
                                    className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiMessageSquare />
                                    Chat with Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
