import React, { useState } from 'react';

const DeleteAccount = () => {
    const [step, setStep] = useState(0);
    const [password, setPassword] = useState('');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
            <div className="text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
                    🗑️
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-4">Delete Account</h2>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 text-sm mb-6 text-left">
                    <strong className="block mb-2 font-bold uppercase tracking-wide">Warning: This action is permanent.</strong>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>All your personal data will be wiped.</li>
                        <li>Your order history will be anonymized.</li>
                        <li>You will lose all earned coupons and rewards.</li>
                        <li>You cannot recover your account once deleted.</li>
                    </ul>
                </div>

                {step === 0 && (
                    <button
                        onClick={() => setStep(1)}
                        className="btn bg-red-600 text-white hover:bg-red-700 px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 w-full md:w-auto"
                    >
                        Start Deletion Process
                    </button>
                )}

                {step === 1 && (
                    <div className="text-left space-y-4 animate-fade-in max-w-sm mx-auto">
                        <label className="block text-sm font-semibold text-gray-700">Enter your password to confirm</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => setStep(0)}
                                className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 btn bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!password}
                                onClick={() => alert('Feature coming soon! Contact support for manual deletion.')}
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteAccount;
