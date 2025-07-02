export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-slate-400">
            Last updated: January 20, 2024
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              NeuroNova ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our research discovery platform, 
              website, and related services (collectively, the "Service"). Please read this privacy policy carefully.
            </p>
          </div>

          <div className="space-y-8">
            {/* Information Collection */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <p className="text-slate-300 mb-4">We may collect the following personal information:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Name, email address, and contact information</li>
                    <li>Academic affiliation, institution, and professional details</li>
                    <li>Profile information, including research interests and expertise</li>
                    <li>Account credentials and authentication information</li>
                    <li>Billing and payment information for premium services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
                  <p className="text-slate-300 mb-4">We automatically collect information about your use of our Service:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Search queries and research activities</li>
                    <li>Articles viewed, bookmarked, or shared</li>
                    <li>Platform navigation patterns and feature usage</li>
                    <li>Device information, IP address, and browser details</li>
                    <li>Log files, cookies, and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Research Content</h3>
                  <p className="text-slate-300 mb-4">When you contribute content to our platform:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Published research papers and articles</li>
                    <li>Comments, reviews, and discussions</li>
                    <li>Expert content and educational materials</li>
                    <li>Collaborative research projects and data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How We Use Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Provision</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Provide access to research databases and discovery tools</li>
                    <li>Personalize search results and recommendations</li>
                    <li>Enable collaboration and expert networking</li>
                    <li>Process payments and manage subscriptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Communication</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Send service updates and important notifications</li>
                    <li>Respond to inquiries and provide customer support</li>
                    <li>Share relevant research alerts and recommendations</li>
                    <li>Deliver marketing communications (with consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Improvement and Analytics</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Analyze usage patterns to improve our Service</li>
                    <li>Develop new features and research tools</li>
                    <li>Conduct research and analytics for platform enhancement</li>
                    <li>Ensure security and prevent unauthorized access</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Information Sharing and Disclosure</h2>
              
              <div className="space-y-4">
                <p className="text-slate-300">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Providers</h3>
                  <p className="text-slate-300">We work with trusted third-party service providers for hosting, analytics, payment processing, and customer support.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Research Partners</h3>
                  <p className="text-slate-300">With your consent, we may share aggregated, anonymized data with academic institutions and research partners.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Requirements</h3>
                  <p className="text-slate-300">We may disclose information when required by law, court order, or to protect our rights and safety.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Business Transfers</h3>
                  <p className="text-slate-300">In the event of a merger, acquisition, or sale, user information may be transferred as part of the transaction.</p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Data Security</h2>
              <p className="text-slate-300 mb-4">We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Employee training on data protection best practices</li>
              </ul>
              <p className="text-slate-300 mt-4">
                While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. 
                We cannot guarantee absolute security but will notify you of any significant data breaches as required by law.
              </p>
            </section>

            {/* Your Rights */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Privacy Rights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Access and Portability</h3>
                  <p className="text-slate-300">Request access to your personal data and receive a copy in a portable format.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Correction and Update</h3>
                  <p className="text-slate-300">Update or correct inaccurate personal information in your account settings.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Deletion</h3>
                  <p className="text-slate-300">Request deletion of your personal data, subject to legal and contractual obligations.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Opt-Out</h3>
                  <p className="text-slate-300">Unsubscribe from marketing communications and control cookie preferences.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Restriction and Objection</h3>
                  <p className="text-slate-300">Restrict or object to certain processing activities of your personal data.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <p className="text-blue-300">
                  To exercise your rights, please contact us at privacy@neuronova.com. 
                  We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Cookies and Tracking Technologies</h2>
              <p className="text-slate-300 mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
                <li>Remember your preferences and login status</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized content and recommendations</li>
                <li>Enable social media features and third-party integrations</li>
              </ul>
              <p className="text-slate-300">
                You can control cookie settings through your browser preferences. Note that disabling cookies may affect some functionality of our Service.
              </p>
            </section>

            {/* International Transfers */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">International Data Transfers</h2>
              <p className="text-slate-300 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Binding corporate rules and certification schemes</li>
                <li>Other legally recognized transfer mechanisms</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Children's Privacy</h2>
              <p className="text-slate-300">
                Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. 
                If you believe we have collected information from a child under 16, please contact us immediately, and we will take steps to remove such information.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Changes to This Privacy Policy</h2>
              <p className="text-slate-300">
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. 
                We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. 
                Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              <p className="text-slate-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-slate-300">
                <p><strong>Email:</strong> privacy@neuronova.com</p>
                <p><strong>Address:</strong> 123 Research Drive, Innovation District, San Francisco, CA 94105</p>
                <p><strong>Data Protection Officer:</strong> dpo@neuronova.com</p>
              </div>

              <div className="mt-6 p-4 bg-green-900/30 border border-green-800 rounded-lg">
                <p className="text-green-300">
                  For EU residents: You have the right to lodge a complaint with your local data protection authority if you believe we have not adequately addressed your concerns.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 