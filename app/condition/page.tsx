"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ConditionsPrivacyPage = () => {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

    const tTerms = useTranslations("legal.terms");
    const tPrivacy = useTranslations("legal.privacy");

    // Sections pour les conditions générales
    const termsSections = [
        "object",
        "products",
        "order",
        "payment",
        "delivery",
        "returns",
        "responsibility",
        "data",
        "law"
    ];

    // Sections pour la politique de confidentialité
    const privacySections = [
        "data_collected",
        "use",
        "security",
        "sharing",
        "rights",
        "retention"
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 bg-gray-50 min-h-screen">

            {/* Tabs */}
            <div className="flex gap-2 md:gap-4 mb-8 border-b border-gray-200">
                <button
                    className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all duration-300 ${activeTab === "terms"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                        }`}
                    onClick={() => setActiveTab("terms")}
                >
                    📜 {tTerms("title")}
                </button>
                <button
                    className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-all duration-300 ${activeTab === "privacy"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                        }`}
                    onClick={() => setActiveTab("privacy")}
                >
                    🔒 {tPrivacy("title")}
                </button>
            </div>

            {/* Content - Terms and Conditions */}
            {activeTab === "terms" && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-blue-500 inline-block">
                        {tTerms("title")}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {tTerms("intro")}
                    </p>

                    {termsSections.map((section) => (
                        <div key={section} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                {tTerms(`sections.${section}.title`)}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {tTerms(`sections.${section}.text`)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Content - Privacy Policy */}
            {activeTab === "privacy" && (
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-blue-500 inline-block">
                        {tPrivacy("title")}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {tPrivacy("intro")}
                    </p>

                    {privacySections.map((section) => (
                        <div key={section} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                {tPrivacy(`sections.${section}.title`)}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {tPrivacy(`sections.${section}.text`)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConditionsPrivacyPage;