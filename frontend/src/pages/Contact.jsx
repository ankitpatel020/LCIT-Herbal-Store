import React, { useState } from 'react';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

const HelpCenter = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFAQ, setOpenFAQ] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        user_email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const SERVICE_ID = 'service_placeholder';
        const TEMPLATE_ID = 'template_placeholder';
        const PUBLIC_KEY = 'public_key_placeholder';

        try {
            if (SERVICE_ID === 'service_placeholder') {
                throw new Error('Admin: Configure keys.');
            }

            const templateParams = {
                from_name: formData.name,
                from_email: formData.user_email,
                subject: formData.subject,
                message: formData.message,
                to_name: 'LCIT Admin',
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            toast.success('Message sent! We will respond within 24-48 hours.');
            setFormData({ name: '', user_email: '', subject: '', message: '' });

        } catch (error) {
            console.error('EmailJS Error:', error);
            const msg = error.message === 'Admin: Configure keys.' ? error.message : 'Failed to send message.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const helpCategories = [
        { id: 'orders', icon: '📦', label: 'Orders & Shipping', color: 'bg-blue-50 text-blue-600 border-blue-200' },
        { id: 'returns', icon: '🔄', label: 'Returns & Refunds', color: 'bg-orange-50 text-orange-600 border-orange-200' },
        { id: 'payments', icon: '💳', label: 'Payments', color: 'bg-purple-50 text-purple-600 border-purple-200' },
        { id: 'account', icon: '👤', label: 'Account', color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
        { id: 'student', icon: '🎓', label: 'Student Discounts', color: 'bg-green-50 text-green-600 border-green-200' },
        { id: 'products', icon: '🌿', label: 'Product Info', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ];

    const faqs = [
        {
            category: 'orders',
            question: 'How can I track my order?',
            answer: 'Once your order is shipped, you will receive a tracking link via email. You can also track your order from the "My Orders" section in your profile. Click on any order to view real-time tracking details.'
        },
        {
            category: 'orders',
            question: 'How long does delivery take?',
            answer: 'Standard delivery within Bilaspur takes 1-2 business days. For other locations in Chhattisgarh, delivery takes 3-5 business days. Pan-India delivery typically takes 5-7 business days.'
        },
        {
            category: 'orders',
            question: 'Can I cancel my order?',
            answer: 'You can cancel your order within 2 hours of placing it, provided it has not been shipped yet. Go to "My Orders" in your profile and click on "Cancel Order". Once shipped, cancellation is not possible.'
        },
        {
            category: 'returns',
            question: 'What is your return policy?',
            answer: 'We accept returns within 7 days of delivery for unopened products in original packaging. Perishable items like fresh herbal products cannot be returned. Please contact our support team to initiate a return.'
        },
        {
            category: 'returns',
            question: 'How do I get a refund?',
            answer: 'Refunds are processed within 5-7 business days after we receive the returned product. The amount will be credited back to your original payment method. Cash on delivery refunds are processed via bank transfer.'
        },
        {
            category: 'payments',
            question: 'What payment methods do you accept?',
            answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery. Online payments are processed securely through Razorpay.'
        },
        {
            category: 'payments',
            question: 'Is online payment safe?',
            answer: 'Absolutely! All payments are processed through Razorpay, which is PCI DSS compliant. We never store your card details. All transactions are encrypted with 256-bit SSL encryption.'
        },
        {
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Click on "Register" in the top navigation bar. Fill in your details including name, email, and password. You can also sign up using your LCIT student email for automatic student discount eligibility.'
        },
        {
            category: 'account',
            question: 'I forgot my password. What should I do?',
            answer: 'Click on "Login" and then "Forgot Password". Enter your registered email address and we will send you a password reset link. The link is valid for 30 minutes.'
        },
        {
            category: 'student',
            question: 'How do I get the student discount?',
            answer: 'Students of LCIT College can get special discounts! Register with your LCIT email address (@lcit.edu.in) and your student status will be verified. Once verified, discounts are automatically applied at checkout.'
        },
        {
            category: 'student',
            question: 'Are there discounts for faculty members?',
            answer: 'Yes! Faculty members of LCIT College are eligible for special discounts. Register with your official LCIT email and contact the admin team for faculty verification. Faculty discounts are applied automatically after verification.'
        },
        {
            category: 'products',
            question: 'Are your products lab-tested?',
            answer: 'Yes, all our herbal products are tested in the LCIT Department of Chemistry laboratory. Each product undergoes quality checks for purity, potency, and safety before being listed on our store.'
        },
        {
            category: 'products',
            question: 'Do your products have any side effects?',
            answer: 'Our products are made from natural herbal ingredients and are generally safe. However, individual reactions may vary. We recommend reading the product description and ingredients list carefully. Consult a healthcare professional if you have specific concerns.'
        },
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Header */}
            <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
                </div>
                <div className="container-custom relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm mb-6">
                        <span>💡</span>
                        <span>We're here to help you</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Help & Center</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto mb-10">
                        Find answers to frequently asked questions, browse help topics, or reach out to our support team.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help topics..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 outline-none shadow-2xl shadow-black/20 text-base"
                        />
                    </div>
                </div>
            </section>

            {/* Quick Help Categories */}
            <section className="py-12 -mt-8 relative z-20">
                <div className="container-custom">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {helpCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${activeCategory === cat.id
                                    ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200'
                                    : `bg-white ${cat.color} border-transparent shadow-md`
                                    }`}
                            >
                                <span className="text-3xl">{cat.icon}</span>
                                <span className="text-sm font-semibold text-center leading-tight">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {activeCategory === 'all' ? 'Frequently Asked Questions' : `${helpCategories.find(c => c.id === activeCategory)?.label} - FAQ`}
                            </h2>
                            {activeCategory !== 'all' && (
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {filteredFAQs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-5xl block mb-4">🔍</span>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                                <p className="text-gray-500">Try a different search term or browse all categories.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                    className="mt-4 text-green-600 font-semibold hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredFAQs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`bg-white rounded-2xl border transition-all duration-300 ${openFAQ === index ? 'border-green-300 shadow-lg shadow-green-50' : 'border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md'
                                            }`}
                                    >
                                        <button
                                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                            className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                                        >
                                            <div className="flex items-center gap-3 pr-4">
                                                <span className="text-xl flex-shrink-0">
                                                    {helpCategories.find(c => c.id === faq.category)?.icon}
                                                </span>
                                                <span className="font-semibold text-gray-900 text-base">{faq.question}</span>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFAQ === index ? 'rotate-180 text-green-600' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div
                                            className={`transition-all duration-300 overflow-hidden ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-green-600 font-bold tracking-widest uppercase text-sm mb-3 block">Still Need Help?</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Can't find what you're looking for? Our support team is ready to assist you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📍</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>Department of Chemistry</strong><br />
                                            LCIT College of Commerce & Science<br />
                                            Bodri, Bilaspur (C.G.) - 495001
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📧</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                        <p className="text-gray-600 text-sm">science.dept@lcit.edu.in</p>
                                        <p className="text-gray-400 text-xs mt-1">Response time: 24-48 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📞</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                        <p className="text-gray-600 text-sm">+91 7752-000000</p>
                                        <p className="text-gray-400 text-xs mt-1">Mon-Sat, 9:00 AM - 5:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⏰</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
                                        <p className="text-gray-600 text-sm">Monday - Saturday</p>
                                        <p className="text-gray-400 text-xs mt-1">9:00 AM - 5:00 PM IST</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3 bg-gray-50 p-8 md:p-10 rounded-2xl border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span>✉️</span> Send Us a Message
                            </h3>
                            <form onSubmit={sendEmail} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="Order Issue / Product Question / General Inquiry"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                                        placeholder="Describe your issue or question in detail..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps */}
            <section className="pb-16">
                <div className="container-custom">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-64 relative bg-gray-200 max-w-6xl mx-auto">
                        <iframe
                            title="LCIT College Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d82.10!3d22.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDA0JzQ4LjAiTiA4MsKwMDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <a
                            href="https://maps.google.com/?q=LCIT+College+of+Commerce+and+Science+Bodri+Bilaspur"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 bg-white px-5 py-2.5 rounded-xl shadow-lg text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <span>📍</span> Open in Google Maps
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
