import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30 py-16">
            <div className="container-custom mx-auto px-4 max-w-4xl">

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100 p-10 md:p-14">

                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-10 text-gray-700 leading-relaxed">

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                1. Introduction
                            </h2>
                            <p className="mb-4">
                                Welcome to LCIT Herbal Store (“we,” “our,” or “us”). By accessing or using this website,
                                you agree to comply with and be bound by these Terms of Service.
                            </p>
                            <p>
                                This platform is operated by the Department of Chemistry,
                                LCIT College of Commerce & Science, Bodri, Bilaspur (C.G.), India.
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                2. Student & Faculty Verification
                            </h2>
                            <p className="mb-4">
                                Special pricing and discounts are available only to verified LCIT students and faculty.
                                You agree to provide accurate information during verification.
                            </p>
                            <p>
                                Any misuse, misrepresentation, or fraudulent claim of eligibility may result in
                                account suspension and cancellation of associated benefits.
                            </p>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                3. Product Disclaimer
                            </h2>
                            <p className="mb-4">
                                All products are formulated by students under faculty supervision within an academic
                                laboratory environment. These products are developed for educational and demonstration purposes.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>We do not claim medical diagnosis, treatment, or cure of any disease.</li>
                                <li>Users should perform patch tests before topical use.</li>
                                <li>Consult a healthcare professional for medical conditions.</li>
                            </ul>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                4. Pricing & Payments
                            </h2>
                            <p className="mb-4">
                                Prices are subject to change without prior notice.
                                We reserve the right to modify or discontinue products at any time.
                            </p>
                            <p>
                                Payment processing is handled via authorized third-party payment gateways.
                            </p>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                5. Orders & Cancellations
                            </h2>
                            <p className="mb-4">
                                Orders may be cancelled before dispatch. Once shipped, cancellation
                                may not be possible.
                            </p>
                            <p>
                                We reserve the right to cancel orders due to stock limitations,
                                pricing errors, or suspected misuse.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                6. User Content & Reviews
                            </h2>
                            <p>
                                By submitting feedback, reviews, or comments, you grant us the right to
                                use, reproduce, and display such content for promotional or informational purposes.
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                7. Personal Information
                            </h2>
                            <p>
                                Personal data collected through this platform is governed by our Privacy Policy.
                                We implement reasonable safeguards to protect your data.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                8. Limitation of Liability
                            </h2>
                            <p>
                                LCIT Herbal Store shall not be liable for any indirect,
                                incidental, or consequential damages arising from the use of our products or website.
                            </p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                9. Governing Law
                            </h2>
                            <p>
                                These Terms shall be governed in accordance with the laws of India.
                                Jurisdiction shall lie exclusively in Bilaspur, Chhattisgarh.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                10. Contact Information
                            </h2>
                            <p>
                                For any queries regarding these Terms, please contact:
                            </p>
                            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                                <p><strong>Email:</strong> support@lcitherbal.com</p>
                                <p><strong>Address:</strong> Department of Chemistry, LCIT College, Bodri, Bilaspur (C.G.), India</p>
                            </div>
                        </section>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Terms;