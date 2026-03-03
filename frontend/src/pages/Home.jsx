import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiCheckCircle, FiStar, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 }
    }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const Home = () => {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts({ limit: 4 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30">

            {/* HERO */}
            <section className="relative pt-32 pb-28 overflow-hidden">

                {/* Floating animated leaf blur */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -left-20 top-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
                />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >

                        {/* LEFT */}
                        <motion.div variants={fadeUp} className="space-y-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow">
                                <FaLeaf className="text-emerald-600" />
                                <span className="text-sm font-semibold text-emerald-800 uppercase">
                                    LCIT Chemistry Herbal Lab
                                </span>
                            </div>

                            <h1 className="text-6xl font-serif font-extrabold text-gray-900 leading-tight">
                                Purely <span className="text-emerald-700">Herbal</span><br />
                                Crafted with Care
                            </h1>

                            <p className="text-xl text-gray-700 max-w-xl">
                                Lab-verified botanical blends where tradition meets science.
                            </p>

                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-3 bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-800 transition"
                            >
                                Discover Remedies
                                <FiArrowRight />
                            </Link>
                        </motion.div>

                        {/* RIGHT IMAGE */}
                        <motion.div
                            variants={fadeUp}
                            className="relative hidden lg:block"
                        >
                            <img
                                src="/assets/herbal/mortar-pestle.jpg"
                                alt=""
                                className="rounded-3xl shadow-2xl"
                            />

                            {/* Floating Badge Animation */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-2xl shadow-xl"
                            >
                                <div className="text-emerald-700 font-bold text-lg">
                                    100% Pure
                                </div>
                                <p className="text-sm text-gray-600">
                                    Lab Certified
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* TRUST SECTION */}
            <section className="py-24 bg-white">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="container-custom grid md:grid-cols-4 gap-10"
                >
                    {[
                        { icon: FiCheckCircle, title: "Student Crafted" },
                        { icon: FiShield, title: "Lab Tested" },
                        { icon: FiHeart, title: "Locally Sourced" },
                        { icon: FiTrendingUp, title: "Faculty Guided" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="text-center"
                        >
                            <item.icon className="mx-auto w-10 h-10 text-emerald-600 mb-4" />
                            <h4 className="font-bold text-lg">{item.title}</h4>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* PRODUCTS */}
            <section className="py-28 bg-emerald-50/40">
                <div className="container-custom">
                    <h2 className="text-4xl font-serif font-bold text-center mb-16">
                        Fresh Herbal Innovations
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-96 bg-white animate-pulse rounded-3xl"></div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {products?.slice(0, 4).map((product) => (
                                <motion.div key={product._id} variants={fadeUp}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;