import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllUsers,
    getPendingStudentVerifications,
    approveStudentVerification,
    rejectStudentVerification,
    deleteUser,
    reset as resetUsers,
} from '../../store/slices/userSlice';
import toast from 'react-hot-toast';

const Users = () => {
    const dispatch = useDispatch();
    const { users, pendingStudents, isLoading, isError, message } = useSelector(
        (state) => state.users
    );

    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getPendingStudentVerifications());

        return () => {
            dispatch(resetUsers());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleApprove = (id) => {
        if (window.confirm('Are you sure you want to approve this student?')) {
            dispatch(approveStudentVerification(id))
                .unwrap()
                .then(() => {
                    toast.success('Student verified successfully');
                    dispatch(getAllUsers());
                })
                .catch((err) => toast.error(err));
        }
    };

    const handleReject = (id) => {
        const reason = window.prompt('Enter reason for rejection:');
        if (reason) {
            dispatch(rejectStudentVerification({ id, reason }))
                .unwrap()
                .then(() => {
                    toast.success('Student verification rejected');
                    dispatch(getAllUsers());
                })
                .catch((err) => toast.error(err));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            dispatch(deleteUser(id))
                .unwrap()
                .then(() => {
                    toast.success('User deleted successfully');
                })
                .catch((err) => toast.error(err));
        }
    };

    return (
        <>
            <div className="section pt-0 px-0">
                <div className="w-full">
                    <h1 className="text-3xl font-display font-bold mb-8">Manage Users</h1>

                    <div className="flex space-x-4 mb-6 border-b">
                        <button
                            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'all'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Users
                        </button>
                        <button
                            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'pending'
                                ? 'border-b-2 border-primary-600 text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Verifications
                            {pendingStudents.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {pendingStudents.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading users...</div>
                    ) : (
                        <>
                            {activeTab === 'pending' && (
                                <div className="overflow-x-auto bg-white rounded-lg shadow mb-8">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-orange-50 border-b border-orange-100">
                                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                                <th className="p-4 font-semibold text-gray-600">Student ID</th>
                                                <th className="p-4 font-semibold text-gray-600">Dept / Year</th>
                                                <th className="p-4 font-semibold text-gray-600">ID Proof</th>
                                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingStudents.map((student) => (
                                                <tr key={student._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-4 font-medium">{student.name}</td>
                                                    <td className="p-4">{student.email}</td>
                                                    <td className="p-4 font-mono text-sm">
                                                        {student.studentVerificationStatus === 'pending' ? (
                                                            <>
                                                                <span className="block text-xs text-gray-400 mb-1">STUDENT</span>
                                                                {student.studentId}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="block text-xs text-blue-400 mb-1">FACULTY</span>
                                                                {student.employeeId}
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {student.studentVerificationStatus === 'pending' ? (
                                                            <>{student.department} (Year {student.yearOfStudy})</>
                                                        ) : (
                                                            <>{student.facultyDepartment} ({student.designation})</>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {(student.studentVerificationStatus === 'pending' ? student.studentIdProof : student.facultyIdProof) ? (
                                                            <a
                                                                href={student.studentVerificationStatus === 'pending' ? student.studentIdProof : student.facultyIdProof}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline text-sm"
                                                            >
                                                                View ID
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Not uploaded</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleApprove(student._id)}
                                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(student._id)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingStudents.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                                        No pending verifications.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'all' && (
                                <div className="overflow-x-auto bg-white rounded-lg shadow">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 border-b">
                                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                                <th className="p-4 font-semibold text-gray-600">Phone</th>
                                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                                <th className="p-4 font-semibold text-gray-600">Address</th>
                                                <th className="p-4 font-semibold text-gray-600">Verified</th>
                                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3">
                                                                <img
                                                                    src={
                                                                        user.avatar && user.avatar !== 'https://res.cloudinary.com/demo/image/upload/avatar-default.png'
                                                                            ? user.avatar
                                                                            : 'https://ui-avatars.com/api/?name=User&background=random'
                                                                    }
                                                                    alt={user.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="font-medium">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm">{user.email}</td>
                                                    <td className="p-4 text-sm">{user.phone || '-'}</td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${user.role === 'admin'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : user.role === 'agent'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600">
                                                        {user.address?.city ? `${user.address.city}, ${user.address.state}` : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.isLCITStudent ? (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                LCIT Student
                                                            </span>
                                                        ) : user.isLCITFaculty ? (
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                LCIT Faculty
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.isActive ? (
                                                            <span className="text-green-600 text-sm font-medium">Active</span>
                                                        ) : (
                                                            <span className="text-red-600 text-sm font-medium">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleDelete(user._id)}
                                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="p-8 text-center text-gray-500">
                                                        No users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Users;
