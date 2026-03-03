import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAdminFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reset,
} from '../../store/slices/faqSlice';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiHelpCircle } from 'react-icons/fi';

const FAQs = () => {
    const dispatch = useDispatch();
    const { faqs, isLoading, isError, message, isSuccess } = useSelector((state) => state.faqs);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        question: '',
        answer: '',
        category: 'General',
        isActive: true,
    });

    const categories = ['Orders', 'Payments', 'Delivery', 'General'];

    useEffect(() => {
        dispatch(getAdminFAQs());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }

        if (isSuccess && message) {
            toast.success(message);
            setIsModalOpen(false);
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch]);

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setIsEditMode(true);
            setFormData({
                id: faq._id,
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                isActive: faq.isActive,
            });
        } else {
            setIsEditMode(false);
            setFormData({
                id: '',
                question: '',
                answer: '',
                category: 'General',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            dispatch(updateFAQ({ id: formData.id, faqData: formData }));
        } else {
            dispatch(createFAQ(formData));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            dispatch(deleteFAQ(id));
        }
    };

    const handleToggleStatus = (faq) => {
        dispatch(updateFAQ({ id: faq._id, faqData: { ...faq, isActive: !faq.isActive } }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto text-gray-800">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold flex items-center gap-3">
                            <FiHelpCircle className="text-emerald-600" />
                            FAQ Management
                        </h1>
                        <p className="text-gray-500 mt-1">Manage frequently asked questions for your customers</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20"
                    >
                        <FiPlus /> Add FAQ
                    </button>
                </div>

                {/* FAQ List */}
                <div className="grid gap-6">
                    {faqs.length === 0 && !isLoading ? (
                        <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-gray-100">
                            <FiHelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No FAQs found</h3>
                            <button onClick={() => handleOpenModal()} className="mt-4 text-emerald-600 hover:underline">Create your first FAQ</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">
                                        <th className="px-6 py-4">Question</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {faqs.map((faq) => (
                                        <tr key={faq._id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 truncate max-w-md">{faq.question}</p>
                                                <p className="text-sm text-gray-400 truncate max-w-md mt-0.5">{faq.answer}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                                    {faq.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleToggleStatus(faq)} className="focus:outline-none">
                                                    {faq.isActive ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                                                            <FiToggleRight size={20} /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-gray-400 text-sm font-bold">
                                                            <FiToggleLeft size={20} /> Inactive
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(faq)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Edit FAQ"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete FAQ"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-2xl font-extrabold text-gray-900">
                                    {isEditMode ? 'Edit FAQ' : 'Add New FAQ'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-white transition shadow-sm">✕</button>
                            </div>

                            <form onSubmit={handleOnSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Question</label>
                                    <input
                                        type="text"
                                        name="question"
                                        value={formData.question}
                                        onChange={handleOnChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                                        placeholder="What is your question?"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleOnChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleOnChange}
                                                className="w-5 h-5 rounded-md text-emerald-600 border-gray-300 focus:ring-emerald-500 transition cursor-pointer"
                                            />
                                            <span className="text-sm font-bold text-gray-600 group-hover:text-emerald-600 transition">Published & Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Answer</label>
                                    <textarea
                                        name="answer"
                                        value={formData.answer}
                                        onChange={handleOnChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm resize-none"
                                        placeholder="Provide a detailed answer..."
                                        rows="6"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : isEditMode ? 'Update FAQ' : 'Create FAQ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQs;
