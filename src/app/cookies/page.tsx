export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-xl text-slate-400">
            Last updated: January 20, 2024
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
            <p className="text-slate-300 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
              They are widely used to make websites work more efficiently and provide information to website owners. 
              NeuroNova uses cookies to enhance your browsing experience, analyze usage patterns, and provide personalized content.
            </p>
          </div>

          <div className="space-y-8">
            {/* Types of Cookies */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                  <p className="text-slate-300 mb-4">These cookies are necessary for the website to function properly and cannot be disabled:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                    <li><strong>Security:</strong> Protect against cross-site request forgery</li>
                    <li><strong>Session Management:</strong> Maintain your browsing session</li>
                    <li><strong>Preferences:</strong> Remember your language and display settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Performance Cookies</h3>
                  <p className="text-slate-300 mb-4">These cookies help us understand how visitors interact with our website:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong>Analytics:</strong> Google Analytics to measure website usage</li>
                    <li><strong>Performance Monitoring:</strong> Track page load times and errors</li>
                    <li><strong>Heat Mapping:</strong> Understand user behavior patterns</li>
                    <li><strong>Search Analytics:</strong> Improve search functionality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Functional Cookies</h3>
                  <p className="text-slate-300 mb-4">These cookies enhance functionality and personalization:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong>Personalization:</strong> Remember your research interests</li>
                    <li><strong>User Interface:</strong> Save your preferred layout and themes</li>
                    <li><strong>Bookmarks:</strong> Store your saved articles and searches</li>
                    <li><strong>Recommendations:</strong> Improve content suggestions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Marketing Cookies</h3>
                  <p className="text-slate-300 mb-4">These cookies are used for advertising and marketing purposes:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong>Targeted Advertising:</strong> Show relevant research content</li>
                    <li><strong>Social Media:</strong> Enable sharing on social platforms</li>
                    <li><strong>Campaign Tracking:</strong> Measure marketing effectiveness</li>
                    <li><strong>Retargeting:</strong> Show relevant content across the web</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Third-Party Cookies</h2>
              
              <div className="space-y-4">
                <p className="text-slate-300">We use services from trusted third-party providers that may place cookies on your device:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Google Services</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        <li>Google Analytics (Analytics)</li>
                        <li>Google Fonts (Performance)</li>
                        <li>Google Maps (Functionality)</li>
                        <li>reCAPTCHA (Security)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Academic Services</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        <li>CrossRef (Research Data)</li>
                        <li>ORCID (Author Identification)</li>
                        <li>arXiv (Paper Access)</li>
                        <li>Semantic Scholar (Citations)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Social Media</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        <li>Twitter Widgets</li>
                        <li>LinkedIn Share</li>
                        <li>ResearchGate Integration</li>
                        <li>YouTube Embeds</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Payment & Support</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        <li>Stripe (Payment Processing)</li>
                        <li>Intercom (Customer Support)</li>
                        <li>Zendesk (Help Desk)</li>
                        <li>Mailchimp (Email Marketing)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Managing Your Cookie Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Browser Settings</h3>
                  <p className="text-slate-300 mb-4">You can control cookies through your browser settings:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Chrome</h4>
                      <p className="text-sm text-slate-300">Settings → Privacy and Security → Cookies and other site data</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Firefox</h4>
                      <p className="text-sm text-slate-300">Settings → Privacy & Security → Cookies and Site Data</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Safari</h4>
                      <p className="text-sm text-slate-300">Preferences → Privacy → Manage Website Data</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Edge</h4>
                      <p className="text-sm text-slate-300">Settings → Cookies and site permissions → Cookies and site data</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">NeuroNova Cookie Controls</h3>
                  <p className="text-slate-300 mb-4">Use our cookie preference center to customize your experience:</p>
                  
                  <div className="bg-slate-700 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Essential Cookies</h4>
                          <p className="text-sm text-slate-300">Required for basic website functionality</p>
                        </div>
                        <div className="text-green-400 font-semibold">Always On</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Performance Cookies</h4>
                          <p className="text-sm text-slate-300">Help us improve website performance</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                          Enable
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Functional Cookies</h4>
                          <p className="text-sm text-slate-300">Enable personalized features</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                          Enable
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Marketing Cookies</h4>
                          <p className="text-sm text-slate-300">Show relevant content and ads</p>
                        </div>
                        <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm">
                          Disable
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-600">
                      <div className="flex space-x-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                          Save Preferences
                        </button>
                        <button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded">
                          Accept All
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">
                          Reject All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Details */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Detailed Cookie Information</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-2 text-white">Cookie Name</th>
                      <th className="text-left py-3 px-2 text-white">Purpose</th>
                      <th className="text-left py-3 px-2 text-white">Duration</th>
                      <th className="text-left py-3 px-2 text-white">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-700">
                      <td className="py-3 px-2 font-mono">neuronova_session</td>
                      <td className="py-3 px-2">User authentication and session management</td>
                      <td className="py-3 px-2">Session</td>
                      <td className="py-3 px-2">Essential</td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="py-3 px-2 font-mono">user_preferences</td>
                      <td className="py-3 px-2">Store user interface and search preferences</td>
                      <td className="py-3 px-2">1 year</td>
                      <td className="py-3 px-2">Functional</td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="py-3 px-2 font-mono">_ga</td>
                      <td className="py-3 px-2">Google Analytics user identification</td>
                      <td className="py-3 px-2">2 years</td>
                      <td className="py-3 px-2">Performance</td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="py-3 px-2 font-mono">research_history</td>
                      <td className="py-3 px-2">Track research activity for recommendations</td>
                      <td className="py-3 px-2">6 months</td>
                      <td className="py-3 px-2">Functional</td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="py-3 px-2 font-mono">notification_prefs</td>
                      <td className="py-3 px-2">Email and notification preferences</td>
                      <td className="py-3 px-2">1 year</td>
                      <td className="py-3 px-2">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Data Protection */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Data Protection and Privacy</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Security Measures</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>All cookies are transmitted securely using HTTPS encryption</li>
                    <li>Sensitive data is never stored in cookies</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Compliance with GDPR, CCPA, and other privacy regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Retention</h3>
                  <p className="text-slate-300">
                    We retain cookie data only for as long as necessary to fulfill the purposes outlined in this policy. 
                    Performance and marketing cookies are automatically deleted after their specified retention period.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">International Transfers</h3>
                  <p className="text-slate-300">
                    Some of our third-party services may transfer cookie data internationally. We ensure appropriate 
                    safeguards are in place, including adequacy decisions and standard contractual clauses.
                  </p>
                </div>
              </div>
            </section>

            {/* Updates and Contact */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Policy Updates and Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Policy Updates</h3>
                  <p className="text-slate-300">
                    We may update this Cookie Policy periodically to reflect changes in our practices or applicable laws. 
                    We will notify you of material changes by posting the updated policy on our website and updating the 
                    "Last updated" date. Continued use of our website after changes become effective constitutes acceptance 
                    of the updated policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                  <p className="text-slate-300 mb-4">
                    If you have questions about this Cookie Policy or want to exercise your rights regarding cookies:
                  </p>
                  <div className="space-y-2 text-slate-300">
                    <p><strong>Email:</strong> privacy@neuronova.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@neuronova.com</p>
                    <p><strong>Address:</strong> 123 Research Drive, Innovation District, San Francisco, CA 94105</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                  <p className="text-blue-300">
                    <strong>Your Rights:</strong> You have the right to withdraw consent for non-essential cookies at any time. 
                    You can also request information about what cookies we use and how your data is processed. 
                    Contact us using the information above to exercise these rights.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 