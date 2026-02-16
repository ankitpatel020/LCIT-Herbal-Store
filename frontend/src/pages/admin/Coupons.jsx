import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    clearCouponState,
} from "../../store/slices/couponSlice";
import toast from "react-hot-toast";

const initialFormState = {
    id: "",
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    perUserLimit: "",
    isActive: true,
    applicableFor: "all",
    description: "",
};

const Coupons = () => {
    const dispatch = useDispatch();

    const {
        coupons,
        listStatus,
        createStatus,
        updateStatus,
        deleteStatus,
        error,
        message,
    } = useSelector((state) => state.coupons);

    const isFetching = listStatus === "loading";
    const isSaving =
        createStatus === "loading" || updateStatus === "loading";
    const isDeleting = deleteStatus === "loading";

    const [formData, setFormData] = useState(initialFormState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        code,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        validFrom,
        validUntil,
        usageLimit,
        perUserLimit,
        isActive,
        applicableFor,
        description,
    } = formData;

    /* =============================
       FETCH COUPONS
    ============================== */
    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch]);

    /* =============================
       CLOSE MODAL
    ============================== */
    const closeModal = useCallback(() => {
        setFormData(initialFormState);
        setIsEditMode(false);
        setIsModalOpen(false);
    }, []);

    /* =============================
       TOAST HANDLING
    ============================== */
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearCouponState());
        }

        if (
            createStatus === "success" ||
            updateStatus === "success" ||
            deleteStatus === "success"
        ) {
            toast.success(message || "Operation successful");
            closeModal();
            dispatch(clearCouponState());
        }
    }, [
        error,
        createStatus,
        updateStatus,
        deleteStatus,
        message,
        dispatch,
        closeModal,
    ]);

    /* =============================
       OPEN MODAL
    ============================== */
    const openModal = (coupon = null) => {
        if (coupon) {
            setIsEditMode(true);
            setFormData({
                id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderValue: coupon.minOrderAmount || "",
                maxDiscount: coupon.maxDiscountAmount || "",
                validFrom: coupon.startDate
                    ? new Date(coupon.startDate).toISOString().split("T")[0]
                    : "",
                validUntil: coupon.expiryDate
                    ? new Date(coupon.expiryDate).toISOString().split("T")[0]
                    : "",
                usageLimit: coupon.usageLimit || "",
                perUserLimit: coupon.perUserLimit || 1,
                isActive: coupon.isActive,
                applicableFor:
                    coupon.applicableFor === "lcit-students"
                        ? "students"
                        : coupon.applicableFor === "first-time"
                            ? "firstTime"
                            : "all",
                description: coupon.description || "",
            });
        } else {
            setIsEditMode(false);
            setFormData(initialFormState);
        }

        setIsModalOpen(true);
    };

    /* =============================
       FORM CHANGE
    ============================== */
    const onChange = (e) => {
        const value =
            e.target.type === "checkbox"
                ? e.target.checked
                : e.target.value;

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: value,
        }));
    };

    /* =============================
       SUBMIT
    ============================== */
    const onSubmit = (e) => {
        e.preventDefault();

        if (!validUntil) {
            toast.error("Expiry date is required");
            return;
        }

        if (validFrom && new Date(validUntil) <= new Date(validFrom)) {
            toast.error("Expiry must be after start date");
            return;
        }

        const validApplicableFor = {
            all: "all",
            students: "lcit-students",
            firstTime: "first-time",
        };

        const couponData = {
            code: code.toUpperCase().trim(),
            description,
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: minOrderValue ? Number(minOrderValue) : 0,
            maxDiscountAmount:
                discountType === "percentage" && maxDiscount
                    ? Number(maxDiscount)
                    : null,
            startDate: validFrom ? new Date(validFrom) : undefined,
            expiryDate: new Date(validUntil),
            usageLimit: usageLimit ? Number(usageLimit) : null,
            perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
            isActive,
            applicableFor:
                validApplicableFor[applicableFor] || "all",
        };

        if (isEditMode) {
            dispatch(updateCoupon({ id: formData.id, couponData }));
        } else {
            dispatch(createCoupon(couponData));
        }
    };

    /* =============================
       DELETE
    ============================== */
    const onDelete = (id) => {
        if (window.confirm("Delete this coupon?")) {
            dispatch(deleteCoupon(id));
        }
    };

    return (
        <>
            <div className="section pt-0 px-0">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Coupons</h1>
                        <button
                            onClick={() => openModal()}
                            className="btn btn-primary"
                        >
                            + Create Coupon
                        </button>
                    </div>

                    {isFetching ? (
                        <div className="text-center py-10">
                            Loading...
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-4">CODE</th>
                                        <th className="p-4">TYPE</th>
                                        <th className="p-4">VALUE</th>
                                        <th className="p-4">VALID UNTIL</th>
                                        <th className="p-4">USAGE</th>
                                        <th className="p-4">STATUS</th>
                                        <th className="p-4">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="border-b">
                                            <td className="p-4 font-mono font-bold">
                                                {coupon.code}
                                            </td>
                                            <td className="p-4 capitalize">
                                                {coupon.discountType}
                                            </td>
                                            <td className="p-4">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}%`
                                                    : `₹${coupon.discountValue}`}
                                            </td>
                                            <td className="p-4">
                                                {new Date(
                                                    coupon.expiryDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                {coupon.usageCount || 0} /{" "}
                                                {coupon.usageLimit || "∞"}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${coupon.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {coupon.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => openModal(coupon)}
                                                    className="text-blue-600 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDelete(coupon._id)
                                                    }
                                                    className="text-red-600"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {coupons.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="p-8 text-center"
                                            >
                                                No coupons found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* MODAL */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b flex justify-between">
                                    <h2 className="text-xl font-bold">
                                        {isEditMode
                                            ? "Edit Coupon"
                                            : "Create Coupon"}
                                    </h2>
                                    <button onClick={closeModal}>✕</button>
                                </div>

                                <form
                                    onSubmit={onSubmit}
                                    className="p-6 space-y-4"
                                >
                                    <input
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={onChange}
                                        placeholder="Coupon Code"
                                        className="input uppercase"
                                        required
                                    />

                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={discountValue}
                                        onChange={onChange}
                                        placeholder="Discount Value"
                                        className="input"
                                        required
                                    />

                                    <textarea
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                        placeholder="Description"
                                        className="input"
                                        rows="3"
                                        required
                                    />

                                    <input
                                        type="date"
                                        name="validUntil"
                                        value={validUntil}
                                        onChange={onChange}
                                        className="input"
                                        required
                                    />

                                    <div className="flex justify-end gap-3">
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
                                            disabled={isSaving}
                                        >
                                            {isSaving
                                                ? "Saving..."
                                                : isEditMode
                                                    ? "Update Coupon"
                                                    : "Create Coupon"}
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

export default Coupons;
