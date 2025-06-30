'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="prose prose-blue max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-6">
                Welcome to Neuronova. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, and share your information when you use our platform.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Account information (name, email, professional credentials)</li>
                <li>Profile information</li>
                <li>Research and publication data</li>
                <li>Communication preferences</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Provide and maintain our services</li>
                <li>Improve and personalize your experience</li>
                <li>Process your research submissions</li>
                <li>Communicate with you about our services</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-6">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Service providers who assist in platform operations</li>
                <li>Research partners (with your explicit consent)</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational security measures to protect your information. 
                However, no system is completely secure, and we cannot guarantee the absolute security of your data.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Withdraw consent</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-6">
                We use cookies and similar tracking technologies to improve your browsing experience, 
                analyze site traffic, and understand where our visitors come from.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: privacy@neuronova.ai</p>
                <p className="text-gray-700">Address: [Your Company Address]</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link 
                  href="/"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                >
                  ← Back to Home
                </Link>
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Neuronova. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 