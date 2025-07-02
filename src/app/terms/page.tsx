export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-slate-400">
            Last updated: January 20, 2024
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and NeuroNova ("Company," "we," "us," or "our") 
              concerning your access to and use of the NeuroNova research discovery platform, website, and related services (the "Service"). 
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
            </p>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptance of Terms</h2>
              <p className="text-slate-300 mb-4">
                By creating an account, accessing, or using the NeuroNova Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                You also agree to comply with our Privacy Policy, which is incorporated by reference into these Terms.
              </p>
              <p className="text-slate-300">
                If you are accessing the Service on behalf of an organization, you represent and warrant that you have the authority to bind such organization to these Terms.
              </p>
            </section>

            {/* Description of Service */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Description of Service</h2>
              <p className="text-slate-300 mb-4">NeuroNova provides:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Research discovery and search capabilities across multiple academic databases</li>
                <li>AI-powered recommendations and semantic search functionality</li>
                <li>Collaboration tools for researchers and academics</li>
                <li>Expert content including courses, webinars, and educational materials</li>
                <li>Analytics and insights for research trends and patterns</li>
                <li>API access for developers and institutional partners</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">User Accounts</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Creation</h3>
                  <p className="text-slate-300">
                    To access certain features, you must create an account. You must provide accurate, current, and complete information and 
                    maintain the security of your account credentials.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>You are responsible for all activities under your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                    <li>You may not share your account credentials with others</li>
                    <li>You may not create multiple accounts or false identities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Termination</h3>
                  <p className="text-slate-300">
                    You may delete your account at any time. We may suspend or terminate your account for violations of these Terms or other legitimate business reasons.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptable Use Policy</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Permitted Uses</h3>
                  <p className="text-slate-300 mb-2">You may use the Service for:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Legitimate research and academic purposes</li>
                    <li>Educational activities and learning</li>
                    <li>Professional development and collaboration</li>
                    <li>Personal research interests within legal bounds</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Prohibited Uses</h3>
                  <p className="text-slate-300 mb-2">You may not:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Upload malicious software or harmful content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated scripts to scrape or download content excessively</li>
                    <li>Share content that is illegal, harmful, or offensive</li>
                    <li>Impersonate others or provide false information</li>
                    <li>Interfere with the proper functioning of the Service</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property Rights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">NeuroNova's IP</h3>
                  <p className="text-slate-300">
                    The Service, including its software, design, content, and trademarks, is owned by NeuroNova and protected by intellectual property laws. 
                    You may not copy, modify, distribute, or create derivative works without our explicit permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">User Content</h3>
                  <p className="text-slate-300 mb-2">
                    You retain ownership of content you submit to the Service. By submitting content, you grant us a license to:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Display, distribute, and promote your content within the Service</li>
                    <li>Make your content searchable and discoverable</li>
                    <li>Create anonymized analytics and insights</li>
                    <li>Ensure technical functionality and security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Content</h3>
                  <p className="text-slate-300">
                    Research papers and content from external sources remain the property of their respective owners. 
                    Use of such content is subject to applicable copyright laws and licensing terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy and Data Protection</h2>
              <p className="text-slate-300 mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy. 
                By using the Service, you consent to the practices described in our Privacy Policy.
              </p>
              <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <p className="text-blue-300">
                  Please review our <a href="/privacy" className="underline hover:text-blue-200">Privacy Policy</a> to understand how we handle your information.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Terms</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Subscription Plans</h3>
                  <p className="text-slate-300">
                    We offer various subscription plans with different features and usage limits. 
                    Pricing and plan details are available on our website and may change with notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Billing and Payments</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Subscription fees are billed in advance on a recurring basis</li>
                    <li>You must provide valid payment information</li>
                    <li>Payments are non-refundable except as required by law</li>
                    <li>We may suspend service for failed payments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cancellation</h3>
                  <p className="text-slate-300">
                    You may cancel your subscription at any time. Cancellation will be effective at the end of your current billing period.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Disclaimers and Limitations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Service Availability</h3>
                  <p className="text-slate-300">
                    While we strive for high availability, we do not guarantee uninterrupted access to the Service. 
                    We may experience downtime for maintenance, updates, or technical issues.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Accuracy</h3>
                  <p className="text-slate-300">
                    We aggregate content from various sources but do not guarantee its accuracy, completeness, or reliability. 
                    Users should verify information independently for critical decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Services</h3>
                  <p className="text-slate-300">
                    Our Service may integrate with third-party platforms and databases. 
                    We are not responsible for the availability, content, or practices of these external services.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Limitation of Liability</h2>
              <p className="text-slate-300 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEURONOVA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR 
                RELATING TO YOUR USE OF THE SERVICE.
              </p>
              <p className="text-slate-300">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE SHALL NOT EXCEED 
                THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Indemnification */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Indemnification</h2>
              <p className="text-slate-300">
                You agree to indemnify, defend, and hold harmless NeuroNova and its officers, directors, employees, and agents from any claims, 
                damages, losses, or expenses arising out of your use of the Service, violation of these Terms, or infringement of any rights of a third party.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Dispute Resolution</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Governing Law</h3>
                  <p className="text-slate-300">
                    These Terms are governed by the laws of the State of California, without regard to conflict of law principles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Arbitration</h3>
                  <p className="text-slate-300">
                    Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the 
                    Commercial Arbitration Rules of the American Arbitration Association.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Class Action Waiver</h3>
                  <p className="text-slate-300">
                    You waive any right to participate in class action lawsuits or class-wide arbitration against NeuroNova.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Changes to Terms</h2>
              <p className="text-slate-300">
                We may modify these Terms at any time by posting the updated version on our website. 
                Your continued use of the Service after changes become effective constitutes acceptance of the new Terms. 
                We will provide notice of material changes as required by law.
              </p>
            </section>

            {/* Termination */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Termination</h2>
              <p className="text-slate-300 mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice, for violations of these Terms or other legitimate reasons. 
                Upon termination, your right to use the Service will cease immediately.
              </p>
              <p className="text-slate-300">
                Sections of these Terms that by their nature should survive termination will remain in effect, 
                including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-slate-300 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-slate-300">
                <p><strong>Email:</strong> legal@neuronova.com</p>
                <p><strong>Address:</strong> 123 Research Drive, Innovation District, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </section>

            {/* Severability */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Severability</h2>
              <p className="text-slate-300">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated 
                to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 