import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
                <div className="absolute inset-0">
                    <img
                        src="/LCITCollegeCampus.webp"
                        alt="LCIT College Campus"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
                </div>
                <div className="relative z-10 container-custom px-4">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400 text-green-300 text-sm font-semibold mb-4 backdrop-blur-sm">
                        Department of Science
                    </span>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
                        LCIT College of Commerce & Science
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light">
                        Bodri, Bilaspur (C.G.)
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-20">
                <div className="container-custom grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Bridging Education & Innovation</h2>
                        <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Welcome to the <strong>LCIT Herbal Store</strong>, a unique initiative by the Department of Science. We believe in practical learning that goes beyond textbooks.
                            </p>
                            <p>
                                Our platform showcases products researched, formulated, and developed by our talented students under the expert guidance of our faculty. Located in Bodri, Bilaspur, we utilize the rich herbal biodiversity of Chhattisgarh to create authentic, natural remedies.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-green-100 rounded-xl transform rotate-3"></div>
                        <img
                            src="/DepartmentofScience.jpg"
                            alt="Department of Science Team"
                            className="relative rounded-xl shadow-lg w-full"
                        />
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-green-500">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-6">👁️</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
                            <p className="text-gray-600">
                                To foster a culture of research, innovation, and entrepreneurship among students, empowering them to transform traditional herbal knowledge into modern, scientifically validated products.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-sm border-t-4 border-blue-500">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-6">🎯</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide high-quality, natural herbal products to the community while offering students real-world experience in pharmaceutical sciences, manufacturing, and quality assurance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Process */}
            <section className="py-20 bg-green-900 text-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">The LCIT Standard</h2>
                        <p className="text-green-200 max-w-2xl mx-auto">From the lush gardens of Chhattisgarh to our advanced laboratories.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-5xl font-bold text-green-400 mb-2">100%</div>
                            <div className="text-lg">Student Leads</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-green-400 mb-2">50+</div>
                            <div className="text-lg">Herbal Formulations</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-green-400 mb-2">ISO</div>
                            <div className="text-lg">Lab Standards</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-green-400 mb-2">24/7</div>
                            <div className="text-lg">Faculty Mentorship</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Voice */}
            <section className="py-20 container-custom">
                <div className="max-w-4xl mx-auto bg-green-50 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="text-5xl text-green-200 absolute top-4 left-4">"</div>
                    <div className="relative z-10">
                        <p className="text-xl md:text-2xl text-gray-800 font-medium italic mb-8">
                            "The practical exposure at LCIT is unmatched. Creating products that people actually use and love gives us immense confidence as future pharmacists and scientists."
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Student+Rep&background=random" alt="Student" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Ankit Patel</div>
                                <div className="text-sm text-green-600">B.Sc. Student, Dept of Science</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-6">Visit Our Campus</h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        LCIT College of Commerce & Science, Bodri, Bilaspur (C.G.)
                        <br />
                        Come see our labs and meet the team.
                    </p>
                    <Link to="/help-center" className="btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-bold">
                        Get in Touch
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default About;