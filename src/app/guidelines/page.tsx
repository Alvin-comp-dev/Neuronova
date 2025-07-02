export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Community Guidelines</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Our guidelines ensure NeuroNova remains a respectful, productive, and trustworthy platform for the global research community.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              NeuroNova is dedicated to democratizing access to research and fostering collaboration among researchers worldwide. 
              These guidelines help maintain the integrity, quality, and respectful nature of our community while promoting open science and innovation.
            </p>
          </div>

          <div className="space-y-8">
            {/* Core Principles */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Core Principles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Respect & Integrity</h3>
                      <p className="text-slate-300">Treat all community members with respect, regardless of their background, expertise level, or research field.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Open Science</h3>
                      <p className="text-slate-300">Support transparency, reproducibility, and accessibility in research practices.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Quality & Accuracy</h3>
                      <p className="text-slate-300">Share accurate information and cite sources appropriately to maintain research quality.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Collaboration</h3>
                      <p className="text-slate-300">Foster meaningful connections and cross-disciplinary collaboration among researchers.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Ethical Conduct</h3>
                      <p className="text-slate-300">Adhere to research ethics, data protection standards, and intellectual property laws.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-600 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">6</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Continuous Learning</h3>
                      <p className="text-slate-300">Embrace learning opportunities and share knowledge to benefit the broader community.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Guidelines */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Content Guidelines</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-green-400">✓ Encouraged Content</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>High-quality research papers, preprints, and academic publications</li>
                    <li>Thoughtful discussions about research methodologies and findings</li>
                    <li>Educational content, tutorials, and learning resources</li>
                    <li>Constructive peer reviews and feedback</li>
                    <li>Announcements of conferences, workshops, and academic events</li>
                    <li>Open-source tools, datasets, and reproducible research</li>
                    <li>Cross-disciplinary collaboration opportunities</li>
                    <li>Professional networking and mentorship initiatives</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-red-400">✗ Prohibited Content</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Plagiarized or improperly attributed content</li>
                    <li>Discriminatory, harassing, or offensive material</li>
                    <li>Spam, promotional content, or commercial advertisements</li>
                    <li>Pseudoscience, misinformation, or debunked theories</li>
                    <li>Personal attacks or unprofessional behavior</li>
                    <li>Copyright violations or unauthorized sharing of paid content</li>
                    <li>Content that promotes illegal activities</li>
                    <li>Off-topic discussions unrelated to research and academia</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Research Ethics */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Research Ethics Standards</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Integrity</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Ensure accuracy and honesty in data collection and reporting</li>
                    <li>Avoid fabrication, falsification, or selective reporting of results</li>
                    <li>Maintain proper documentation and record-keeping practices</li>
                    <li>Share raw data when possible to support reproducibility</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Human Subjects Research</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Obtain appropriate ethical approvals and informed consent</li>
                    <li>Protect participant privacy and confidentiality</li>
                    <li>Minimize risks and maximize benefits to participants</li>
                    <li>Ensure fair selection and inclusion of research subjects</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Animal Research</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Follow the principles of replacement, reduction, and refinement (3Rs)</li>
                    <li>Obtain institutional animal care and use committee approval</li>
                    <li>Ensure humane treatment and minimize animal suffering</li>
                    <li>Use appropriate sample sizes and statistical methods</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Environmental Responsibility</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Consider environmental impact of research activities</li>
                    <li>Follow proper protocols for handling hazardous materials</li>
                    <li>Implement sustainable research practices when possible</li>
                    <li>Report and address environmental concerns appropriately</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Publication Standards */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Publication & Citation Standards</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Authorship</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Include only individuals who have made substantial contributions</li>
                    <li>Ensure all authors have reviewed and approved the final manuscript</li>
                    <li>Disclose any conflicts of interest or funding sources</li>
                    <li>Give appropriate credit to all contributors and collaborators</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Citation Practices</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Cite all sources accurately and completely</li>
                    <li>Use appropriate citation formats for your discipline</li>
                    <li>Include both supporting and contradictory evidence</li>
                    <li>Avoid excessive self-citation or citation manipulation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Peer Review</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Provide constructive, timely, and unbiased reviews</li>
                    <li>Maintain confidentiality of submitted manuscripts</li>
                    <li>Declare any conflicts of interest with authors or topics</li>
                    <li>Focus on scientific merit rather than personal opinions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Community Behavior */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Community Behavior Standards</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Professional Communication</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Use respectful and professional language in all interactions</li>
                    <li>Provide constructive criticism and feedback</li>
                    <li>Acknowledge limitations and uncertainties in your work</li>
                    <li>Be open to different perspectives and approaches</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Inclusive Environment</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Welcome researchers from all backgrounds and career stages</li>
                    <li>Avoid discriminatory language or behavior</li>
                    <li>Support diversity in research perspectives and methodologies</li>
                    <li>Provide mentorship and guidance to early-career researchers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Knowledge Sharing</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Share knowledge freely while respecting intellectual property</li>
                    <li>Provide helpful answers to questions within your expertise</li>
                    <li>Direct others to appropriate resources and experts</li>
                    <li>Contribute to open science initiatives when possible</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Reporting & Enforcement */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Reporting & Enforcement</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Reporting Violations</h3>
                  <p className="text-slate-300 mb-2">If you observe behavior that violates these guidelines:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Report the issue through our reporting system</li>
                    <li>Provide specific details and evidence when possible</li>
                    <li>Contact moderators for urgent safety concerns</li>
                    <li>Do not engage in public disputes or retaliation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Enforcement Actions</h3>
                  <p className="text-slate-300 mb-2">Violations may result in:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Warning and educational guidance</li>
                    <li>Temporary suspension of privileges</li>
                    <li>Content removal or modification requirements</li>
                    <li>Permanent account suspension for severe violations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Appeals Process</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Submit appeals within 30 days of enforcement action</li>
                    <li>Provide additional context or evidence for review</li>
                    <li>Appeals will be reviewed by independent moderators</li>
                    <li>Final decisions will be communicated within 14 days</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Resources */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ethics Guidelines</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• World Medical Association Declaration of Helsinki</li>
                    <li>• Committee on Publication Ethics (COPE) Guidelines</li>
                    <li>• International Committee of Medical Journal Editors (ICMJE)</li>
                    <li>• Responsible Conduct of Research (RCR) Training</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Research Resources</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Center for Open Science Framework</li>
                    <li>• FAIR Data Principles</li>
                    <li>• Research Data Management Guidelines</li>
                    <li>• Open Access Publishing Resources</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact & Support */}
            <section className="bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact & Support</h2>
              <p className="text-slate-300 mb-4">
                Have questions about these guidelines or need to report a concern?
              </p>
              <div className="space-y-2 text-slate-300">
                <p><strong>Community Support:</strong> community@neuronova.com</p>
                <p><strong>Ethics Questions:</strong> ethics@neuronova.com</p>
                <p><strong>Report Violations:</strong> report@neuronova.com</p>
                <p><strong>General Help:</strong> <a href="/help" className="text-blue-400 hover:text-blue-300 underline">Help Center</a></p>
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <p className="text-blue-300">
                  These guidelines are living documents that evolve with our community. 
                  We welcome feedback and suggestions for improvement.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 