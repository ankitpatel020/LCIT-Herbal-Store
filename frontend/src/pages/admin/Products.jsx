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

// Use frontend env override when available, or default to relative /api for production proxy
const API_URL = process.env.REACT_APP_API_URL || '/api';

const initialFormState = {
    id: '',
    name: '',
    price: '',
    image: null,
    category: 'Herbal Soaps',
    stock: 0,
    description: '',
    studentDiscount: 25,
    facultyDiscount: 50,
};

const Products = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message, isSuccess } = useSelector(
        (state) => state.products
    );
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

    const { name, price, image, category, stock, description, studentDiscount, facultyDiscount } = formData;

    // 🔹 Fetch products
    useEffect(() => {
        dispatch(getProducts({}));
    }, [dispatch]);

    // 🔹 Handle success / error
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

    const openModal = (product = null) => {
        if (product) {
            setIsEditMode(true);

            // normalize image to object
            let imageState = null;
            if (product.images && product.images.length > 0) {
                const firstImage = product.images[0];
                if (typeof firstImage === 'string') {
                    imageState = { url: firstImage };
                } else {
                    imageState = firstImage;
                }
            } else if (product.image) {
                // Legacy support
                imageState = { url: product.image };
            }

            setFormData({
                id: product._id,
                name: product.name,
                price: product.price,
                image: imageState,
                category: product.category || 'Herbal Soaps',
                stock: product.stock,
                description: product.description,
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
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // 🔹 Image Upload
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // File size check (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size too large. Max 5MB allowed.');
            return;
        }

        const data = new FormData();
        data.append('image', file);
        // data.append('folder', 'lcit-herbal-store/products'); // accurate folder

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            console.log('Initiating upload...');
            const res = await axios.post(`${API_URL}/upload/image`, data, config);
            console.log('Upload success:', res.data);

            setFormData((prev) => ({
                ...prev,
                // Store full image object from response
                image: {
                    url: res.data.data.url,
                    public_id: res.data.data.public_id
                },
            }));

            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error('Upload Error Details:', err);
            if (err.response) {
                console.error('Error Response Data:', err.response.data);
                console.error('Error Status:', err.response.status);
            } else if (err.request) {
                console.error('No response received:', err.request);
            } else {
                console.error('Error Message:', err.message);
            }

            const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
            toast.error(`Upload failed: ${errorMessage}`);
        } finally {
            setUploading(false);
            // Reset file input value so same file can be selected again if needed
            e.target.value = '';
        }
    };

    // 🔹 Submit
    const onSubmit = (e) => {
        e.preventDefault();

        const productData = {
            name,
            price: Number(price),
            description,
            category,
            stock: Number(stock),
            studentDiscount: Number(studentDiscount),
            facultyDiscount: Number(facultyDiscount),
            // Send array of image objects
            images: image ? [image] : [],
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

    return (
        <>
            <div className="section pt-0 px-0">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Products</h1>
                        <button onClick={() => openModal()} className="btn btn-primary">
                            + Create Product
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Student Disc.</th>
                                        <th className="p-4">Faculty Disc.</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Stock</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-500">
                                                {product._id.slice(-6)}
                                            </td>
                                            <td className="p-4 font-medium">{product.name}</td>
                                            <td className="p-4">₹{product.price}</td>
                                            <td className="p-4">
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">{product.studentDiscount ?? 25}%</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{product.facultyDiscount ?? 50}%</span>
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
                                    ))}

                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-gray-500">
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-2xl">
                                <div className="p-6 border-b flex justify-between items-center">
                                    <h2 className="text-xl font-bold">
                                        {isEditMode ? 'Edit Product' : 'Create Product'}
                                    </h2>
                                    <button onClick={closeModal}>✕</button>
                                </div>

                                <form onSubmit={onSubmit} className="p-6 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input name="name" value={name} onChange={onChange} className="input" placeholder="Name" required />
                                        <input type="number" name="price" value={price} onChange={onChange} className="input" placeholder="Price" required />
                                        <select name="category" value={category} onChange={onChange} className="input">
                                            {categories.map((cat) => (
                                                <option key={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <input type="number" name="stock" value={stock} onChange={onChange} className="input" placeholder="Stock" required />
                                    </div>

                                    <div className="space-y-2">
                                        <input type="hidden" name="image" value={image?.url || image || ''} required />

                                        <div className="flex items-center gap-2">
                                            <input type="file" onChange={uploadFileHandler} className="text-sm" accept="image/*" />
                                            {uploading && <span className="text-sm text-blue-500">Uploading...</span>}
                                        </div>

                                        {image && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={image?.url || image}
                                                    alt="Preview"
                                                    className="h-24 w-24 object-cover rounded-md border border-gray-200"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <textarea name="description" value={description} onChange={onChange} rows="4" className="input" placeholder="Description" required />

                                    {/* Discount Fields */}
                                    <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div>
                                            <label className="block text-sm font-semibold text-green-700 mb-1">🎓 Student Discount (%)</label>
                                            <input
                                                type="number"
                                                name="studentDiscount"
                                                value={studentDiscount}
                                                onChange={onChange}
                                                className="input"
                                                placeholder="25"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-blue-700 mb-1">👨‍🏫 Faculty Discount (%)</label>
                                            <input
                                                type="number"
                                                name="facultyDiscount"
                                                value={facultyDiscount}
                                                onChange={onChange}
                                                className="input"
                                                placeholder="50"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={closeModal} className="btn bg-gray-200">Cancel</button>
                                        <button type="submit" className="btn btn-primary" disabled={isLoading || uploading}>
                                            {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;
