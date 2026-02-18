import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reset,
} from '../../store/slices/productSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const initialFormState = {
    id: '',
    name: '',
    price: '',
    images: [],
    category: 'Herbal Soaps',
    stock: 0,
    description: '',
    originalPrice: '',
    studentDiscount: 25,
    facultyDiscount: 50,
};

const Products = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message, isSuccess } =
        useSelector((state) => state.products);
    const { token } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    const categories = useMemo(() => [
        'Herbal Soaps',
        'Natural Oils',
        'Ayurvedic Powders',
        'Face Packs',
        'Plant Medicines',
        'Hair Care',
        'Skin Care',
        'Wellness',
        'Other',
    ], []);

    const {
        name,
        price,
        originalPrice,
        images,
        category,
        stock,
        description,
        studentDiscount,
        facultyDiscount,
    } = formData;

    /* ===============================
       FETCH PRODUCTS
    =============================== */
    useEffect(() => {
        dispatch(getProducts({}));
    }, [dispatch]);

    /* ===============================
       SUCCESS / ERROR HANDLING
    =============================== */
    useEffect(() => {
        if (isError) {
            toast.error(message || 'Something went wrong');
            dispatch(reset());
        }

        if (isSuccess && message) {
            toast.success(message);
            if (isModalOpen) closeModal();
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch, isModalOpen]);

    /* ===============================
       LIVE DISCOUNT PREVIEW
    =============================== */
    const discountPreview = useMemo(() => {
        const mrpValue = Number(originalPrice);
        const priceValue = Number(price);

        if (!mrpValue || !priceValue) return 0;
        if (mrpValue <= priceValue) return 0;

        return Math.round(((mrpValue - priceValue) / mrpValue) * 100);
    }, [originalPrice, price]);

    /* ===============================
       MODAL
    =============================== */
    const openModal = (product = null) => {
        if (product) {
            setIsEditMode(true);

            let imageList = [];
            if (product.images?.length > 0) {
                imageList = product.images.map(img =>
                    typeof img === 'string' ? { url: img } : img
                );
            }

            setFormData({
                id: product._id,
                name: product.name,
                price: product.price,
                images: imageList,
                category: product.category || 'Herbal Soaps',
                stock: product.stock,
                description: product.description,
                originalPrice: product.originalPrice || '',
                studentDiscount: product.studentDiscount ?? 25,
                facultyDiscount: product.facultyDiscount ?? 50,
            });
        } else {
            setIsEditMode(false);
            setFormData(initialFormState);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setFormData(initialFormState);
    };

    const onChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    /* ===============================
       IMAGE UPLOAD
    =============================== */
    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const invalidFile = files.find(file => file.size > 5 * 1024 * 1024);
        if (invalidFile) {
            toast.error(`File ${invalidFile.name} exceeds 5MB limit`);
            return;
        }

        const data = new FormData();
        files.forEach(file => data.append('images', file));

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            const res = await axios.post(
                `${API_URL}/upload/images`,
                data,
                config
            );

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...res.data.data],
            }));

            toast.success(`${files.length} image(s) uploaded`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove),
        }));
    };

    /* ===============================
       SUBMIT
    =============================== */
    const onSubmit = (e) => {
        e.preventDefault();

        if (originalPrice && Number(originalPrice) < Number(price)) {
            return toast.error('MRP must be greater than Price');
        }

        const productData = {
            name,
            price: Number(price),
            description,
            category,
            stock: Number(stock),
            originalPrice: Number(originalPrice) || 0,
            studentDiscount: Number(studentDiscount),
            facultyDiscount: Number(facultyDiscount),
            images,
        };

        if (isEditMode) {
            dispatch(updateProduct({ id: formData.id, productData }));
        } else {
            dispatch(createProduct(productData));
        }
    };

    const onDelete = (id) => {
        if (window.confirm('Delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    /* ===============================
       UI
    =============================== */
    return (
        <div className="section pt-0 px-0">
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <button onClick={() => openModal()} className="btn btn-primary">
                        + Create Product
                    </button>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const hasDiscount =
                                    product.originalPrice > product.price;

                                const discount =
                                    hasDiscount
                                        ? Math.round(
                                            ((product.originalPrice -
                                                product.price) /
                                                product.originalPrice) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{product.name}</td>

                                        <td className="p-4">
                                            {hasDiscount ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ₹{product.originalPrice.toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="font-bold text-green-600">
                                                        ₹{product.price.toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="text-[10px] text-green-700 font-bold">
                                                        {discount}% OFF
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold">
                                                    ₹{product.price.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4">{product.category}</td>
                                        <td className="p-4">{product.stock}</td>

                                        <td className="p-4 space-x-3">
                                            <button
                                                onClick={() => openModal(product)}
                                                className="text-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(product._id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4">
                            <h2 className="text-xl font-bold">
                                {isEditMode ? 'Edit Product' : 'Create Product'}
                            </h2>

                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        className="input"
                                        placeholder="Name"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        value={price}
                                        onChange={onChange}
                                        className="input"
                                        placeholder="Price"
                                        required
                                    />
                                    <select
                                        name="category"
                                        value={category}
                                        onChange={onChange}
                                        className="input"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={stock}
                                        onChange={onChange}
                                        className="input"
                                        placeholder="Stock"
                                        required
                                    />
                                </div>

                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <label className="btn btn-sm bg-gray-200 cursor-pointer">
                                            Choose Images
                                            <input
                                                type="file"
                                                multiple
                                                onChange={uploadFileHandler}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        <span className="text-xs text-gray-500">Max 5MB each</span>
                                        {uploading && <span className="text-sm text-blue-500 animate-pulse">Uploading...</span>}
                                    </div>

                                    {images && images.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                            {images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img?.url || img}
                                                        alt={`Preview ${index}`}
                                                        className="h-24 w-full object-cover rounded-md border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        title="Remove Image"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">MRP (Original Price)</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={originalPrice}
                                            onChange={onChange}
                                            className="input mt-1"
                                            placeholder="e.g. 1999"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Student Discount (%)</label>
                                        <input
                                            type="number"
                                            name="studentDiscount"
                                            value={studentDiscount}
                                            onChange={onChange}
                                            className="input mt-1"
                                            placeholder="25"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Faculty Discount (%)</label>
                                        <input
                                            type="number"
                                            name="facultyDiscount"
                                            value={facultyDiscount}
                                            onChange={onChange}
                                            className="input mt-1"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                {discountPreview > 0 && (
                                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                                        🔥 <b>{discountPreview}% OFF</b> Calculated based on MRP vs Price
                                        <div className="text-xs mt-1 text-gray-600">
                                            ₹{Number(originalPrice).toLocaleString('en-IN')} → ₹{Number(price).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    className="input"
                                    placeholder="Description"
                                    rows="3"
                                    required
                                />

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="btn bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading || uploading}
                                    >
                                        {isLoading || uploading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
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

export default Products;
