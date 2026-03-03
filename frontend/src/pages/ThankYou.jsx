import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight, FiShoppingBag, FiMail } from 'react-icons/fi';

export const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Smooth scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/40 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute w-[900px] h-[900px] bg-emerald-300/20 blur-[140px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse -z-10"></div>

      <div className="bg-white/90 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-emerald-900/10 border border-emerald-100 max-w-2xl w-full text-center relative z-10">

        {/* Success Icon */}
        <div className="mb-10 relative inline-block">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40 animate-ping"></div>
          <div className="relative w-24 h-24 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center mx-auto border-4 border-white">
            <FiCheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
          Order Confirmed 🎉
        </h1>

        <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-md mx-auto">
          Your herbal formulations are now being prepared inside our supervised laboratory.
        </p>

        <p className="text-sm text-gray-500 mb-10 flex items-center justify-center gap-2">
          <FiMail className="text-emerald-600" />
          A confirmation email has been sent to you.
        </p>

        {/* Order Reference */}
        {orderId && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                Order Reference
              </span>
              <p className="text-2xl font-mono font-bold text-gray-900 uppercase">
                #{orderId.slice(-8)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Estimated Processing: 24–48 Hours
              </p>
            </div>

            <Link
              to={`/order/${orderId}`}
              className="bg-white text-emerald-700 font-bold px-6 py-3.5 rounded-full shadow-sm border border-emerald-100 hover:shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 group"
            >
              <FiPackage className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Track Order
            </Link>

          </div>
        )}

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link
            to="/shop"
            className="bg-emerald-600 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
          >
            <FiShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="bg-white text-gray-700 font-bold py-4 px-6 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
          >
            View All Orders
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Footer */}
        <div className="mt-12 pt-8 border-t border-emerald-100 text-sm text-gray-500 flex items-center justify-center gap-2">
          <span>🌿</span>
          <p>
            Crafted under faculty supervision at LCIT Chemistry Lab.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ThankYou;