import React, { useState } from 'react';

const DeactivateAccount = () => {
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
            <div className="text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
                    ⚠️
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Deactivate Account</h2>
                <p className="text-gray-500 mb-8">
                    Deactivating your account will temporarily disable your profile and remove your name and photo from most things you've shared. You can reactivate it anytime by logging back in.
                </p>

                {!confirmed ? (
                    <button
                        onClick={() => setConfirmed(true)}
                        className="btn bg-red-50 text-red-600 hover:bg-red-100 px-8 py-3 rounded-xl font-bold border border-red-200"
                    >
                        I understand, proceed
                    </button>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <p className="font-bold text-red-700">Are you absolutely sure?</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setConfirmed(false)}
                                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg font-medium shadow-lg shadow-red-200"
                                onClick={() => alert('Feature coming soon!')}
                            >
                                Confirm Deactivation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeactivateAccount;
