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

        const API_URL = process.env.REACT_APP_API_URL || '/api';
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
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100/50 p-8 relative overflow-hidden transition-all duration-300">
            {/* Elegant Header Gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-extrabold text-gray-900 tracking-tight">Verification Center</h2>
                    <p className="text-gray-500 font-medium mt-1">Get verified to unlock exclusive campus discounts.</p>
                </div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100 shrink-0">
                    <span className="text-2xl">🎓</span>
                </div>
            </div>

            {/* Premium Pill Tabs */}
            <div className="flex bg-stone-100/80 p-1.5 rounded-2xl mb-10 w-fit border border-stone-200/50 shadow-inner">
                {!user?.isLCITFaculty && (
                    <button
                        onClick={() => setActiveTab('student')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'student' ? 'bg-white shadow-md text-emerald-700' : 'text-gray-500 hover:text-gray-900 hover:bg-stone-200/50'
                            }`}
                    >
                        Student
                    </button>
                )}
                {!user?.isLCITStudent && (
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'faculty' ? 'bg-white shadow-md text-emerald-700' : 'text-gray-500 hover:text-gray-900 hover:bg-stone-200/50'
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">ID Card Photo</label>
                                <div
                                    className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300 cursor-pointer bg-stone-50"
                                    onClick={() => document.getElementById('student-id-upload').click()}
                                >
                                    {verifyData.idProofPreview ? (
                                        <div className="relative inline-block group">
                                            <img src={verifyData.idProofPreview} alt="Preview" className="h-48 object-contain rounded-xl shadow-md group-hover:opacity-90 transition-opacity" />
                                            <button
                                                type="button"
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVerifyData(prev => ({ ...prev, idProofFile: null, idProofPreview: '' }));
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="text-5xl mb-2 hover:scale-110 transition-transform duration-300">�</div>
                                            <p className="font-bold text-gray-700 text-lg">Click to scan ID Card</p>
                                            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">JPG, PNG up to 5MB</p>
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

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading || isUploading}
                                >
                                    {isUploading ? 'Securely Uploading...' : isLoading ? 'Submitting...' : 'Submit Verification'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Faculty Content */}
            {activeTab === 'faculty' && !user?.isLCITStudent && (
                <div className="animate-fade-in">
                    {user.isLCITFaculty ? (
                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-10 text-center shadow-sm">
                            <div className="w-24 h-24 bg-white shadow-sm text-teal-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
                                👨‍🏫
                            </div>
                            <h4 className="text-2xl font-serif font-bold text-teal-900 mb-3">Verified Faculty</h4>
                            <p className="text-teal-700/80 max-w-md mx-auto mb-8 font-medium">
                                You are a verified LCIT Faculty member. Thank you for being part of our community.
                            </p>
                            <div className="bg-white/80 backdrop-blur-sm inline-block px-10 py-6 rounded-2xl text-left shadow-lg border border-teal-50">
                                <p className="mb-2"><span className="font-bold text-teal-900/50 uppercase tracking-widest text-xs w-24 inline-block">Emp ID</span> <span className="font-mono text-teal-900 font-bold ml-4">{user.employeeId}</span></p>
                                <p className="mb-2"><span className="font-bold text-teal-900/50 uppercase tracking-widest text-xs w-24 inline-block">Dept</span> <span className="font-bold text-teal-900 ml-4">{user.facultyDepartment}</span></p>
                                <p><span className="font-bold text-teal-900/50 uppercase tracking-widest text-xs w-24 inline-block">Role</span> <span className="font-bold text-teal-900 ml-4">{user.designation}</span></p>
                            </div>
                        </div>
                    ) : user.facultyVerificationStatus === 'pending' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-10 text-center shadow-sm">
                            <div className="w-24 h-24 bg-white shadow-sm text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
                                ⏳
                            </div>
                            <h4 className="text-2xl font-serif font-bold text-yellow-800 mb-3">Verification Pending</h4>
                            <p className="text-yellow-700/80 max-w-md mx-auto mb-8 font-medium">
                                Your faculty details are under secure review.
                            </p>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to withdraw?')) dispatch(withdrawVerification('faculty'));
                                }}
                                className="text-sm font-bold text-yellow-600 hover:text-yellow-800 border-b-2 border-yellow-200 hover:border-yellow-400 pb-0.5 transition-colors"
                            >
                                Withdraw Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmitFaculty} className="space-y-8">
                            {user.facultyVerificationStatus === 'rejected' && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl mb-6 flex items-start gap-4 shadow-sm">
                                    <span className="text-2xl mt-0.5">⚠️</span>
                                    <div>
                                        <strong className="font-bold text-lg block mb-1">Verification Rejected</strong>
                                        <span className="text-sm">Please check your details and try again. Ensure the image is legible.</span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-5 rounded-2xl text-teal-800 text-sm mb-6 flex items-center gap-4 shadow-sm">
                                <span className="text-2xl">🛡️</span>
                                <p className="font-medium">Faculty verification requires a valid Employee ID and department ID card scan.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={facultyVerifyData.employeeId}
                                    onChange={onFacultyVerifyChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none uppercase font-mono transition-all font-medium text-gray-900"
                                    placeholder="LCITFAC-001"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={facultyVerifyData.department}
                                        onChange={onFacultyVerifyChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none transition-all font-medium text-gray-900"
                                        placeholder="E.g. Chemistry"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={facultyVerifyData.designation}
                                        onChange={onFacultyVerifyChange}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none transition-all font-medium text-gray-900"
                                        placeholder="E.g. Assistant Professor"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ID Card Photo</label>
                                <div
                                    className="border-2 border-dashed border-teal-200 rounded-2xl p-8 text-center hover:border-teal-500 hover:bg-teal-50/30 transition-all duration-300 cursor-pointer bg-stone-50"
                                    onClick={() => document.getElementById('faculty-id-upload').click()}
                                >
                                    {facultyVerifyData.idProofPreview ? (
                                        <div className="relative inline-block group">
                                            <img src={facultyVerifyData.idProofPreview} alt="Preview" className="h-48 object-contain rounded-xl shadow-md group-hover:opacity-90 transition-opacity" />
                                            <button
                                                type="button"
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFacultyVerifyData(prev => ({ ...prev, idProofFile: null, idProofPreview: '' }));
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="text-5xl mb-2 hover:scale-110 transition-transform duration-300">�</div>
                                            <p className="font-bold text-gray-700 text-lg">Click to scan Faculty ID</p>
                                            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">JPG, PNG up to 5MB</p>
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

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-[0_4px_14px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading || isUploading}
                                >
                                    {isUploading ? 'Securely Uploading...' : isLoading ? 'Submitting...' : 'Submit Verification'}
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