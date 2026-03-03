import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30 py-16">
            <div className="container-custom mx-auto px-4 max-w-4xl">

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100 p-10 md:p-14">

                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-10 text-gray-700 leading-relaxed">

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                1. Information We Collect
                            </h2>
                            <p className="mb-4">
                                When you place an order or create an account, we collect
                                personal information such as your name, email address,
                                phone number, and shipping address.
                            </p>
                            <p className="mb-4">
                                <strong>Student/Faculty Verification:</strong> For eligibility-based
                                discounts, we may collect institutional details such as
                                student ID, department, and enrollment year strictly
                                for verification purposes.
                            </p>
                            <p>
                                Payment information is processed securely via authorized
                                third-party payment gateways. We do not store full card details.
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                2. How We Use Your Information
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To process and deliver your orders.</li>
                                <li>To verify discount eligibility.</li>
                                <li>To communicate order updates and support responses.</li>
                                <li>To improve website functionality and user experience.</li>
                                <li>To comply with legal and regulatory requirements.</li>
                            </ul>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                3. Consent
                            </h2>
                            <p>
                                By providing personal information for transactions,
                                account creation, or verification, you consent to
                                our collection and use of that information solely
                                for the stated purpose.
                            </p>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                4. Data Security
                            </h2>
                            <p className="mb-4">
                                We implement reasonable administrative and technical
                                safeguards to protect your information from unauthorized
                                access, misuse, or disclosure.
                            </p>
                            <p>
                                Sensitive payment data is encrypted and handled by secure
                                payment processors compliant with industry standards.
                            </p>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                5. Disclosure of Information
                            </h2>
                            <p className="mb-4">
                                We do not sell or trade your personal data.
                            </p>
                            <p>
                                We may disclose information only when required by law
                                or to trusted service providers assisting with payment
                                processing, order delivery, or technical infrastructure.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                6. Cookies & Tracking
                            </h2>
                            <p>
                                We use cookies and session storage to maintain login
                                sessions, store cart contents, and improve site performance.
                                You may disable cookies in your browser settings, though
                                certain features may not function properly.
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                7. Data Retention
                            </h2>
                            <p>
                                We retain personal data only for as long as necessary
                                to fulfill orders, provide services, and comply with
                                legal obligations.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                8. Changes to This Policy
                            </h2>
                            <p>
                                We reserve the right to update this Privacy Policy at any time.
                                Changes will take effect immediately upon publication
                                on this page.
                            </p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                9. Your Rights
                            </h2>
                            <p>
                                You may request access, correction, or deletion of your
                                personal data by contacting us.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl font-bold text-emerald-700 mb-4">
                                10. Contact Information
                            </h2>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                                <p><strong>Email:</strong> privacy@lcitherbal.com</p>
                                <p><strong>Address:</strong> Department of Chemistry, LCIT College, Bodri, Bilaspur (C.G.), India</p>
                            </div>
                        </section>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;