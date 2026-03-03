import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const ManageAddress = ({ user }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const [addressData, setAddressData] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    const { street, city, state, pincode, country } = addressData;

    useEffect(() => {
        if (user) {
            setAddressData({
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                pincode: user.address?.pincode || '',
                country: user.address?.country || 'India',
            });
        }
    }, [user]);

    const onAddressChange = (e) => {
        setAddressData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmitAddress = (e) => {
        e.preventDefault();

        if (!street || !city || !state || !pincode) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast.error('Enter valid 6-digit pincode');
            return;
        }

        dispatch(updateProfile({ address: addressData }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Shipping Address
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        This address will be used for order delivery.
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-xl">
                    🏠
                </div>
            </div>

            <form onSubmit={onSubmitAddress} className="space-y-8">

                {/* STREET */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                    </label>
                    <input
                        type="text"
                        name="street"
                        value={street}
                        onChange={onAddressChange}
                        placeholder="House No, Street, Area"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                    />
                </div>

                {/* CITY + STATE */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={city}
                            onChange={onAddressChange}
                            placeholder="Bilaspur"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State *
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={state}
                            onChange={onAddressChange}
                            placeholder="Chhattisgarh"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                        />
                    </div>

                </div>

                {/* PINCODE + COUNTRY */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pincode *
                        </label>
                        <input
                            type="text"
                            name="pincode"
                            value={pincode}
                            onChange={onAddressChange}
                            placeholder="495001"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            6-digit Indian postal code
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            value={country}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                </div>

                {/* SUBMIT */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-70"
                    >
                        {isLoading ? 'Saving...' : 'Save Address'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ManageAddress;