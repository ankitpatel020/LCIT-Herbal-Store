import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FiUsers, FiAward, FiZap } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

const About = () => {
    const pillars = [
        {
            title: "Our Vision",
            icon: <FiZap className="w-8 h-8" />,
            description:
                "To build a student-driven herbal science ecosystem where traditional botanicals meet rigorous scientific validation — real R&D experience, not just theory.",
        },
        {
            title: "Our Mission",
            icon: <FiAward className="w-8 h-8" />,
            description:
                "To craft lab-verified, research-backed herbal wellness products while training the next generation of chemists in ethical formulation, quality assurance, and scalable production.",
        },
    ];

    const impact = [
        { value: 100, label: "Student-driven", suffix: "%", icon: <FiUsers className="w-10 h-10" /> },
        { value: 50, label: "Formulas Developed", suffix: "+", icon: <FaLeaf className="w-10 h-10" /> },
        { value: 100, label: "Lab-grade Standards", suffix: "%", icon: <FiZap className="w-10 h-10" /> },
        { value: 100, label: "Faculty Mentorship", suffix: "%", icon: <FiAward className="w-10 h-10" /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30"
        >

            {/* HERO — split with campus image */}
            <section className="relative overflow-hidden">
                <div className="grid lg:grid-cols-2 min-h-[80vh]">
                    {/* Left — text */}
                    <div className="flex flex-col justify-center px-10 lg:px-20 py-28 bg-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full w-fit"
                        >
                            Department of Chemistry · LCIT
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-5xl md:text-6xl font-serif font-extrabold text-gray-900 leading-tight mb-6"
                        >
                            Curiosity{" "}
                            <span className="text-emerald-700">→</span> Science{" "}
                            <span className="text-emerald-700">→</span> Wellness
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-gray-600 leading-relaxed max-w-lg"
                        >
                            Where LCIT students transform classroom chemistry into safe, lab-verified herbal formulations under expert mentorship.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                            className="mt-8 flex gap-4 flex-wrap"
                        >
                            <Link to="/shop" className="px-8 py-3.5 bg-emerald-700 text-white rounded-2xl font-semibold hover:bg-emerald-800 transition">
                                Explore Products
                            </Link>
                            <Link to="/manufacturing" className="px-8 py-3.5 border-2 border-emerald-700 text-emerald-800 rounded-2xl font-semibold hover:bg-emerald-50 transition">
                                Our Process
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right — campus image */}
                    <div className="relative hidden lg:block">
                        <img
                            src="/assets/Campus/LCITCampus2.png"
                            alt="LCIT Campus"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                    </div>
                </div>
            </section>

            {/* CORE STORY — lab images */}
            <section className="py-24 bg-white border-y border-emerald-100">
                <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
                    {/* Lab image mosaic */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <img
                            src="/assets/lab/lab 01.jpg"
                            alt="Lab Work 1"
                            className="rounded-2xl shadow-lg object-cover w-full h-48 col-span-2"
                        />
                        <img
                            src="/assets/lab/lab 02.jpg"
                            alt="Lab Work 2"
                            className="rounded-2xl shadow-md object-cover w-full h-40"
                        />
                        <img
                            src="/assets/lab/lab 03.jpg"
                            alt="Lab Work 3"
                            className="rounded-2xl shadow-md object-cover w-full h-40"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl font-serif font-bold text-gray-900">
                            From Lab Bench to Wellness Product
                        </h2>
                        <p className="text-gray-700 text-lg">
                            Students conduct real extraction, formulation, stability testing, and microbial validation — transforming botanical research into market-ready herbal solutions.
                        </p>
                        <p className="italic text-emerald-800 border-l-4 border-emerald-300 pl-4">
                            "Science-driven herbal innovation rooted in academic excellence."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VISION + MISSION */}
            <section className="py-24">
                <div className="container-custom grid md:grid-cols-2 gap-12">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="bg-white p-10 rounded-3xl shadow-lg border border-emerald-100 hover:-translate-y-2 transition-all"
                        >
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-6">
                                {pillar.icon}
                            </div>
                            <h3 className="text-3xl font-serif font-bold mb-4">
                                {pillar.title}
                            </h3>
                            <p className="text-gray-700 text-lg">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* RESEARCH TIMELINE */}
            <section className="py-24 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <h2 className="text-4xl font-serif font-bold text-center mb-16">
                        Our Research Journey
                    </h2>

                    <div className="space-y-12">
                        {[
                            { step: "01", title: "Botanical Research", text: "Scientific literature review and phytochemical screening." },
                            { step: "02", title: "Extraction & Isolation", text: "Solvent extraction and compound purification." },
                            { step: "03", title: "Formulation Testing", text: "Stability, pH, and microbial analysis." },
                            { step: "04", title: "Product Validation", text: "Quality assurance under faculty supervision." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="flex gap-6"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center font-bold text-emerald-700 shrink-0">
                                    {item.step}
                                </div>
                                <div className="pt-3">
                                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                    <p className="text-gray-600">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IMPACT STATS */}
            <section className="py-24 bg-emerald-900 text-white">
                <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    {impact.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                        >
                            <div className="text-emerald-300 text-5xl flex justify-center mb-4">
                                {stat.icon}
                            </div>
                            <h4 className="text-4xl font-serif font-extrabold">
                                <CountUp end={stat.value} duration={2} />
                                {stat.suffix}
                            </h4>
                            <p className="uppercase text-sm text-emerald-200 tracking-wider mt-2">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* TEAM PHOTO */}
            <section className="py-24 bg-white">
                <div className="container-custom max-w-5xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full"
                    >
                        Our Team
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-serif font-bold text-gray-900 mb-4"
                    >
                        The Minds Behind the Formulations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 mb-10 text-lg"
                    >
                        Students, researchers, and faculty mentors united by a shared purpose — bringing rigorous science to herbal wellness.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-100"
                    >
                        <img
                            src="/assets/group/group.jpeg"
                            alt="LCIT Herbal Store Team"
                            className="w-full object-cover max-h-[520px]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* CAMPUS */}
            <section className="py-8 bg-stone-50">
                <div className="container-custom max-w-5xl mx-auto">
                    <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        src="/assets/Campus/LCITCampus1.jpg"
                        alt="LCIT Campus"
                        className="rounded-3xl shadow-xl w-full object-cover max-h-80"
                    />
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 bg-emerald-50 text-center">
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                    Discover Science-Backed Nature
                </h2>
                <p className="text-lg text-gray-700 mb-10">
                    Explore herbal formulations developed through real research and laboratory precision.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                    <Link to="/shop" className="px-10 py-4 bg-emerald-700 text-white rounded-2xl font-semibold hover:bg-emerald-800 transition">
                        Explore Products
                    </Link>
                    <Link to="/manufacturing" className="px-10 py-4 border-2 border-emerald-700 text-emerald-800 rounded-2xl font-semibold hover:bg-emerald-100 transition">
                        View Manufacturing
                    </Link>
                </div>
            </section>

        </motion.div>
    );
};

export default About;