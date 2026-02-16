import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyStudent, withdrawVerification } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const Verification = ({ user }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('student');
    const [isUploading, setIsUploading] = useState(false);

    // Initial check to set active tab
    useEffect(() => {
        if (user?.isLCITFaculty) {
            setActiveTab('faculty');
        }
    }, [user]);

    // Student State
    const [verifyData, setVerifyData] = useState({
        studentId: '',
        department: '',
        yearOfStudy: '',
        idProofFile: null,
        idProofPreview: '',
    });

    // Faculty State
    const [facultyVerifyData, setFacultyVerifyData] = useState({
        employeeId: '',
        department: '',
        designation: '',
        idProofFile: null,
        idProofPreview: '',
    });

    // Populate Data
    useEffect(() => {
        if (user) {
            if (user.studentId) {
                setVerifyData(prev => ({
                    ...prev,
                    studentId: user.studentId || '',
                    department: user.department || '',
                    yearOfStudy: user.yearOfStudy || '',
                }));
            }
            if (user.employeeId) {
                setFacultyVerifyData(prev => ({
                    ...prev,
                    employeeId: user.employeeId || '',
                    department: user.facultyDepartment || '',
                    designation: user.designation || '',
                }));
            }
        }
    }, [user]);


    // Handlers
    const onVerifyChange = (e) => {
        setVerifyData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onFacultyVerifyChange = (e) => {
        setFacultyVerifyData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size too large. Max 5MB allowed.');
                return;
            }
            setVerifyData((prev) => ({
                ...prev,
                idProofFile: file,
                idProofPreview: URL.createObjectURL(file),
            }));
        }
    };

    const onFacultyFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size too large. Max 5MB allowed.');
                return;
            }
            setFacultyVerifyData((prev) => ({
                ...prev,
                idProofFile: file,
                idProofPreview: URL.createObjectURL(file),
            }));
        }
    };

    const uploadImage = async (file, folder) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.token || localStorage.getItem('token')}`,
            },
        };

        const res = await axios.post(`${API_URL}/upload/image`, formData, config);
        return res.data.data.url;
    };

    const onSubmitStudent = async (e) => {
        e.preventDefault();
        if (!verifyData.idProofFile) {
            toast.error('Please upload your ID card proof');
            return;
        }

        try {
            setIsUploading(true);
            const imageUrl = await uploadImage(verifyData.idProofFile, 'lcit-herbal-store/id-proofs');

            const verificationData = {
                studentId: verifyData.studentId,
                department: verifyData.department,
                yearOfStudy: verifyData.yearOfStudy,
                studentIdProof: imageUrl,
            };

            dispatch(verifyStudent(verificationData));
            setIsUploading(false);
        } catch (error) {
            setIsUploading(false);
            console.error(error);
            toast.error(error.response?.data?.message || 'Error uploading image.');
        }
    };

    const onSubmitFaculty = async (e) => {
        e.preventDefault();
        if (!facultyVerifyData.idProofFile) {
            toast.error('Please upload your Faculty ID card');
            return;
        }

        try {
            setIsUploading(true);
            const imageUrl = await uploadImage(facultyVerifyData.idProofFile, 'lcit-herbal-store/faculty-id-proofs');

            const verificationData = {
                studentId: facultyVerifyData.employeeId, // Reusing field name as per existng logic note
                department: facultyVerifyData.department,
                yearOfStudy: facultyVerifyData.designation,
                studentIdProof: imageUrl,
                isFaculty: true
            };

            dispatch(verifyStudent(verificationData));
            setIsUploading(false);
        } catch (error) {
            setIsUploading(false);
            console.error(error);
            toast.error(error.response?.data?.message || 'Error uploading image.');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600"></div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Verification Center</h2>
                    <p className="text-gray-500 text-sm mt-1">Get verified to unlock exclusive college discounts.</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">
                    ✅
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 p-1 rounded-xl mb-8 w-fit">
                {!user?.isLCITFaculty && (
                    <button
                        onClick={() => setActiveTab('student')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'student' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Student
                    </button>
                )}
                {!user?.isLCITStudent && (
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'faculty' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Faculty
                    </button>
                )}
            </div>

            {/* Student Content */}
            {activeTab === 'student' && !user?.isLCITFaculty && (
                <div>
                    {user.isLCITStudent ? (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                🎓
                            </div>
                            <h4 className="text-xl font-bold text-green-800 mb-2">Verified Student</h4>
                            <p className="text-green-700 max-w-md mx-auto mb-6">
                                You are a verified LCIT student. You are now eligible for exclusive discounts on all herbal products.
                            </p>
                            <div className="bg-white/50 inline-block px-8 py-4 rounded-xl text-left shadow-sm">
                                <p className="mb-1"><span className="font-bold text-green-900 w-24 inline-block">ID:</span> {user.studentId}</p>
                                <p className="mb-1"><span className="font-bold text-green-900 w-24 inline-block">Dept:</span> {user.department}</p>
                                <p><span className="font-bold text-green-900 w-24 inline-block">Year:</span> {user.yearOfStudy}</p>
                            </div>
                        </div>
                    ) : user.studentVerificationStatus === 'pending' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ⏳
                            </div>
                            <h4 className="text-xl font-bold text-yellow-800 mb-2">Verification Pending</h4>
                            <p className="text-yellow-700 max-w-md mx-auto mb-6">
                                Your student verification request is currently under review by our admin team.
                            </p>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to withdraw?')) dispatch(withdrawVerification('student'));
                                }}
                                className="text-sm font-bold text-yellow-700 underline hover:text-yellow-900"
                            >
                                Withdraw Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmitStudent} className="space-y-6">
                            {user.studentVerificationStatus === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
                                    <span className="text-xl mt-0.5">⚠️</span>
                                    <div>
                                        <strong className="font-bold block">Verification Rejected</strong>
                                        <span className="text-sm">Your previous request was rejected. Please double-check your details and ID proof clearly.</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Student Enrollment ID</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={verifyData.studentId}
                                    onChange={onVerifyChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none uppercase font-mono"
                                    placeholder="LCIT123456"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                    <select
                                        name="department"
                                        value={verifyData.department}
                                        onChange={onVerifyChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Biology">Biology</option>
                                        <option value="Pharmacy">Pharmacy</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={verifyData.yearOfStudy}
                                        onChange={onVerifyChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Card Photo</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50 hover:bg-white"
                                    onClick={() => document.getElementById('student-id-upload').click()}
                                >
                                    {verifyData.idProofPreview ? (
                                        <div className="relative inline-block">
                                            <img src={verifyData.idProofPreview} alt="Preview" className="h-48 object-contain rounded-lg shadow-sm" />
                                            <button
                                                type="button"
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVerifyData(prev => ({ ...prev, idProofFile: null, idProofPreview: '' }));
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-4xl">📷</div>
                                            <p className="font-semibold text-gray-600">Click to upload ID Card</p>
                                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        id="student-id-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={onFileChange}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="btn bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading || isUploading}
                                >
                                    {isUploading ? 'Uploading Proof...' : isLoading ? 'Submitting...' : 'Submit Verification'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Faculty Content */}
            {activeTab === 'faculty' && !user?.isLCITStudent && (
                <div>
                    {user.isLCITFaculty ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                👨‍🏫
                            </div>
                            <h4 className="text-xl font-bold text-blue-800 mb-2">Verified Faculty</h4>
                            <p className="text-blue-700 max-w-md mx-auto mb-6">
                                You are a verified LCIT Faculty member. Thank you for being part of our community.
                            </p>
                            <div className="bg-white/50 inline-block px-8 py-4 rounded-xl text-left shadow-sm">
                                <p className="mb-1"><span className="font-bold text-blue-900 w-24 inline-block">ID:</span> {user.employeeId}</p>
                                <p className="mb-1"><span className="font-bold text-blue-900 w-24 inline-block">Dept:</span> {user.facultyDepartment}</p>
                                <p><span className="font-bold text-blue-900 w-24 inline-block">Role:</span> {user.designation}</p>
                            </div>
                        </div>
                    ) : user.facultyVerificationStatus === 'pending' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ⏳
                            </div>
                            <h4 className="text-xl font-bold text-yellow-800 mb-2">Verification Pending</h4>
                            <p className="text-yellow-700 max-w-md mx-auto mb-6">
                                Your faculty details are under verification.
                            </p>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to withdraw?')) dispatch(withdrawVerification('faculty'));
                                }}
                                className="text-sm font-bold text-yellow-700 underline hover:text-yellow-900"
                            >
                                Withdraw Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmitFaculty} className="space-y-6">
                            {user.facultyVerificationStatus === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
                                    <span className="text-xl mt-0.5">⚠️</span>
                                    <div>
                                        <strong className="font-bold block">Verification Rejected</strong>
                                        <span className="text-sm">Please check your details and try again.</span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm mb-6 flex gap-3">
                                <span className="text-xl">ℹ️</span>
                                <p>Faculty verification requires a valid Employee ID and department ID card scan.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={facultyVerifyData.employeeId}
                                    onChange={onFacultyVerifyChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none uppercase font-mono"
                                    placeholder="LCITFAC..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={facultyVerifyData.department}
                                        onChange={onFacultyVerifyChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="E.g. Science"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={facultyVerifyData.designation}
                                        onChange={onFacultyVerifyChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="E.g. Professor"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ID Card Photo</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-white"
                                    onClick={() => document.getElementById('faculty-id-upload').click()}
                                >
                                    {facultyVerifyData.idProofPreview ? (
                                        <div className="relative inline-block">
                                            <img src={facultyVerifyData.idProofPreview} alt="Preview" className="h-48 object-contain rounded-lg shadow-sm" />
                                            <button
                                                type="button"
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFacultyVerifyData(prev => ({ ...prev, idProofFile: null, idProofPreview: '' }));
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-4xl">📷</div>
                                            <p className="font-semibold text-gray-600">Click to upload Faculty ID</p>
                                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        id="faculty-id-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={onFacultyFileChange}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading || isUploading}
                                >
                                    {isUploading ? 'Uploading...' : isLoading ? 'Submitting...' : 'Submit Verification'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default Verification;
