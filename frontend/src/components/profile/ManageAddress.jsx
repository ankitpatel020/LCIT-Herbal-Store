import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';

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
        setAddressData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmitAddress = (e) => {
        e.preventDefault();

        const userData = {
            address: addressData,
        };

        dispatch(updateProfile(userData));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Address</h2>
                    <p className="text-gray-500 text-sm mt-1">Update your shipping details.</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                    🏠
                </div>
            </div>

            <form onSubmit={onSubmitAddress} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                    <input
                        type="text"
                        name="street"
                        value={street}
                        onChange={onAddressChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="123 Main St, Apartment 4B"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={city}
                            onChange={onAddressChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Bilaspur"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <input
                            type="text"
                            name="state"
                            value={state}
                            onChange={onAddressChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Chhattisgarh"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={pincode}
                            onChange={onAddressChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="495001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={country}
                            onChange={onAddressChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating Address...' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageAddress;
