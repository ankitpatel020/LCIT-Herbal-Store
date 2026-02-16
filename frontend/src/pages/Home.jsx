import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts({ limit: 4 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HERO SECTION */}
            <section className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/LCIT-Campus.jpg"
                        alt="LCIT Campus"
                        className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                </div>

                <div className="relative z-10 container-custom px-4 animate-fade-in-up">
                    <div className="inline-block border border-green-400 bg-green-900/30 backdrop-blur-md rounded-full px-6 py-2 mb-6">
                        <span className="text-green-300 font-bold tracking-widest uppercase text-sm">Department of Science</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight drop-shadow-lg">
                        LCIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Herbal Store</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light mb-2">
                        LCIT College of Commerce & Science
                    </p>
                    <p className="text-lg text-gray-400 mb-10">Bodri, Bilaspur (C.G.)</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/shop" className="btn bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1">
                            Browse Collection
                        </Link>
                        <Link to="/about" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg transition-all">
                            Our Story
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </section>

            {/* TRUST INDICATORS */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-600 text-sm md:text-base font-medium">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">🌿</span> 100% Student Made
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">🔬</span> Lab Certified
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">🌱</span> Locally Sourced
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">🎓</span> Faculty Mentored
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Fresh from the Lab</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Latest Innovations</h2>
                        </div>
                        <Link to="/shop" className="hidden md:inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition-colors">
                            View All <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white h-96 rounded-2xl shadow-sm animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products && products.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/shop" className="btn btn-outline border-green-600 text-green-700 w-full rounded-full">Explore Shop</Link>
                    </div>
                </div>
            </section>

            {/* DEPARTMENT SHOWCASE */}
            <section className="py-24 bg-green-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-green-800/20 skew-x-12 transform translate-x-20"></div>
                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-green-300 font-bold tracking-widest uppercase mb-4 block">About the Department</span>
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Where Science Meets Nature</h2>
                            <p className="text-green-100 text-lg mb-8 leading-relaxed max-w-xl">
                                At the Department of Science, LCIT Bodri, we bridge the gap between traditional herbal wisdom and modern pharmaceutical science. Our students gain hands-on experience in formulation, manufacturing, and quality control.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">⚗️</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">State-of-the-art Labs</h4>
                                        <p className="text-green-200 text-sm">Equipped with modern extraction and analysis instruments.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">👨‍🔬</div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Student-Led Research</h4>
                                        <p className="text-green-200 text-sm">Every product starts as a student project.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="absolute -inset-4 bg-green-500/20 rounded-2xl blur-xl"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <img src="/LCITLab.jpg" className="rounded-2xl shadow-2xl w-full h-64 object-cover transform translate-y-8" alt="Lab" />
                                <img src="/ProductDesign.jpg" className="rounded-2xl shadow-2xl w-full h-64 object-cover" alt="Student" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMMUNITY/CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container-custom">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Support Student Innovation</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Every purchase directly supports the research and development initiatives of the Department of Science students.
                    </p>
                    <img src="/LCITGroupPhoto.jpg" className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg mb-12 grayscale hover:grayscale-0 transition-all duration-700" alt="LCIT Students" />

                    <Link to="/about" className="inline-flex items-center text-green-700 font-bold hover:text-green-800 text-lg group">
                        Safety & Quality Standards
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;