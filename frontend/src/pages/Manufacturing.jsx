import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiEye, FiUsers } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const Manufacturing = () => {
  const processSteps = [
    {
      step: "01",
      title: "Botanical Foraging",
      description: "Hand-picking fresh, authentic regional flowers and herbs straight from trusted botanical sources.",
      image: "/Gulal Manufacturing/plucking a flower Step 01.jpg",
    },
    {
      step: "02",
      title: "Botanical Extraction",
      description: "Carefully separating the potent parts of the flower to ensure the highest yield of active ingredients.",
      image: "/Gulal Manufacturing/Extracting Flower step 02.jpg",
    },
    {
      step: "03",
      title: "Juice Squeezing",
      description: "Milling and pressing the botanicals to extract pure, concentrated herbal juices without heat degradation.",
      image: "/Gulal Manufacturing/flower juice squeezer step 03.jpg",
    },
    {
      step: "04",
      title: "Base Mixing",
      description: "Expertly blending the extracted pure juices with natural starches (like corn flour) to form a stable base.",
      image: "/Gulal Manufacturing/Mixing flower juice with corn flour Step 04.jpg",
    },
    {
      step: "05",
      title: "Drying & Curing",
      description: "Gently sun-drying or dehumidifying the herbal mixture to remove excess moisture and prevent microbial growth.",
      image: "/Gulal Manufacturing/drying up step 05.jpg",
    },
    {
      step: "06",
      title: "Fine Filtering",
      description: "Passing the dried mixture through ultra-fine sieves to ensure a smooth, premium texture free of impurities.",
      image: "/Gulal Manufacturing/filter step 06.jpg",
    },
    {
      step: "07",
      title: "Hygienic Packaging",
      description: "Measuring and filling the finely filtered herbal powder into secure, lab-grade containers.",
      image: "/Gulal Manufacturing/packaging box  step 07.jpg",
    },
    {
      step: "08",
      title: "Sealing & Labeling",
      description: "Applying tamper-evident seals and authentic LCIT Department of Chemistry labels to guarantee origin.",
      image: "/Gulal Manufacturing/applying a sticker step 08.jpg",
    },
    {
      step: "09",
      title: "Final Product",
      description: "The finished herbal remedy is securely packaged, quality-checked, and ready to safely deliver wellness.",
      image: "/Gulal Manufacturing/product is finished step 09.jpg",
    },
  ];

  const keyControls = [
    { icon: <FiEye className="w-7 h-7" />, text: "Constant Faculty Supervision" },
    { icon: <FiCheckCircle className="w-7 h-7" />, text: "Digital + Physical Batch Records" },
    { icon: <FiShield className="w-7 h-7" />, text: "Multi-layer Safety Checkpoints" },
    { icon: <FaLeaf className="w-7 h-7" />, text: "100% Natural • Lab-Verified" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30"
    >

      {/* HERO */}
      <section className="relative pt-32 pb-28 bg-emerald-900 text-white overflow-hidden">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-7xl font-serif font-extrabold leading-tight">
              Transparent. <br />
              Supervised. <br />
              <span className="text-emerald-300">Student-Crafted.</span>
            </h1>

            <p className="text-xl text-emerald-100 max-w-xl leading-relaxed">
              Every formulation is created inside our college laboratory with full traceability and uncompromising safety standards. Witness exactly how we transform raw herbs into finished remedies.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-900 font-semibold rounded-2xl shadow-[0_4px_14px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Explore Formulations
              <FaLeaf />
            </Link>
          </motion.div>

          <motion.img
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            src="/assets/group/group.jpeg"
            alt="Chemistry Department Group"
            className="rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-emerald-800/50 transform hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </section>

      {/* TEAM SPOTLIGHT */}
      <section className="py-20 bg-emerald-50/60 border-b border-emerald-100/50">
        <div className="container-custom flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center rotate-3 mb-6 shadow-sm">
            <FiUsers size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Meet the Department of Chemistry
          </h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed text-lg">
            Our vibrant team of dedicated faculty and brilliant science students work tirelessly in the LCIT laboratories. Together, we combine ancient botanical wisdom with modern chemical precision to extract the absolute best out of every single leaf and flower.
          </p>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="py-28 bg-white">
        <div className="container-custom text-center mb-20">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-3 block">Full Transparency</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Raw Herb → Finished Remedy
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Follow our rigorous 9-step laboratory journey, completely documented to guarantee purity at every stage.</p>
        </div>

        <div className="container-custom grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.15 }}
              className="bg-stone-50 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-stone-200/50 flex flex-col group"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Stage {step.step}</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-emerald-600 font-black text-4xl opacity-20 absolute top-4 right-6 group-hover:opacity-40 transition-opacity">
                  {step.step}
                </span>
                <h3 className="text-2xl font-serif font-bold mt-2 mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SAFEGUARDS */}
      <section className="py-28 bg-gradient-to-b from-emerald-50/50 to-stone-50">
        <div className="container-custom">
          <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgba(16,185,129,0.06)] border border-emerald-100/50 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 md:p-20 flex flex-col justify-center">
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                  Safety & Quality Built In
                </h2>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                  Every product leaving the LCIT laboratory passes through a gauntlet of quality assurance checkpoints. We do not compromise on protocol.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {keyControls.map((control, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="text-emerald-500 bg-emerald-50 p-2.5 rounded-xl shrink-0">
                        {control.icon}
                      </div>
                      <p className="font-bold text-gray-800 mt-1">
                        {control.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative h-full min-h-[400px]">
                <img
                  src="/Gulal Manufacturing/filter step 06.jpg"
                  alt="Supervision"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-emerald-900 text-white text-center relative overflow-hidden">
        {/* Background Decals */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-800 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-700 rounded-full blur-[100px]"></div>

        <div className="container-custom relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Discover Lab-Crafted Wellness
          </h2>
          <p className="text-lg text-emerald-100/80 mb-10 max-w-2xl mx-auto font-medium">
            Explore formulations created through scientific precision and botanical wisdom, bottled right here in our chemistry department.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-emerald-900 font-bold rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:-translate-y-1 transition-all"
          >
            Shop Herbal Products
          </Link>
        </div>
      </section>

    </motion.div>
  );
};

export default Manufacturing;