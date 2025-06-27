'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  LightBulbIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface AIAssistantProps {
  researchContent?: string;
  researchTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIResearchAssistant: React.FC<AIAssistantProps> = ({
  researchContent = '',
  researchTitle = 'Research Paper',
  isOpen,
  onClose
}) => {
  const [mode, setMode] = useState<'chat' | 'summarize' | 'insights'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    if (input.includes('hi') || input.includes('hello') || input.includes('hey') || input === 'hi') {
      return `Hello! I'm your AI Research Assistant. I'm here to help you analyze and understand "${researchTitle}".

You can ask me about:
• Key findings and methodology
• Research implications  
• Related studies
• Technical details

What would you like to know?`;
    }
    
    if (input.includes('summary') || input.includes('summarize')) {
      return `Summary of "${researchTitle}":

This research presents innovative approaches with significant implications for the field. The methodology is comprehensive and the findings contribute valuable insights to our understanding of the subject matter.

Key highlights:
• Novel research approach
• Rigorous methodology
• Significant findings
• Practical applications`;
    }
    
    if (input.includes('methodology') || input.includes('method')) {
      return `Research Methodology:

• Systematic data collection
• Rigorous analysis protocols  
• Peer-reviewed validation
• Statistical significance testing

This approach ensures reliable and reproducible results.`;
    }
    
    if (input.includes('findings') || input.includes('results')) {
      return `Key Findings:

The research reveals important insights that advance our understanding of the field. The results demonstrate significant correlations and provide evidence for the proposed hypotheses.

Main discoveries:
• Innovative solutions identified
• Strong empirical evidence
• Practical implications
• Future research directions`;
    }

    return `Regarding "${input}" in the context of "${researchTitle}":

This research offers valuable perspectives on your question. The findings suggest important implications for future research and practical applications in the field. 

Would you like me to elaborate on any specific aspect?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);

    setInputMessage('');
  };

  const suggestedQuestions = [
    "Hi there!",
    "What are the key findings?",
    "Explain the methodology",
    "What are the implications?"
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <SparklesIcon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">AI Research Assistant</h2>
                  <p className="text-sm text-blue-100 truncate max-w-xs">{researchTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Buttons */}
            <div className="flex space-x-2 mt-6">
              {[
                { id: 'chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
                { id: 'summarize', icon: DocumentMagnifyingGlassIcon, label: 'Summary' },
                { id: 'insights', icon: LightBulbIcon, label: 'Insights' }
              ].map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={() => setMode(button.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      mode === button.id 
                        ? 'bg-white text-indigo-600 shadow-lg transform scale-105' 
                        : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{button.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-96 flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-black">
          {mode === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-700/80 to-slate-800/90 dark:from-slate-900/90 dark:to-black/95">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <SparklesIcon className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <h3 className="text-xl font-semibold text-white dark:text-slate-200 mb-2">
                        Ask me anything about this research!
                      </h3>
                      <p className="text-slate-300 dark:text-slate-400 mb-6">
                        Try one of these questions to get started:
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(question)}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-3 rounded-2xl shadow-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 text-white border border-slate-500/30 dark:border-slate-600/30'
                      }`}
                    >
                      <div className="whitespace-pre-line text-sm leading-relaxed font-medium">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 opacity-80 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-slate-300'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-600 dark:bg-slate-700 px-4 py-3 rounded-2xl border border-slate-500/30 dark:border-slate-600/30 shadow-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-slate-600/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-500/50 dark:border-slate-700/50">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Ask about this research..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-300 disabled:opacity-50 shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'summarize' && (
            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
              <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-200">AI Summary</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
                <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-200 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Key Findings
                </h4>
                <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• Advanced research methodology employed with rigorous validation</li>
                  <li>• Significant contributions to advancing field knowledge</li>
                  <li>• Novel insights with clear practical applications</li>
                  <li>• Strong empirical evidence supporting conclusions</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
                <h4 className="font-semibold mb-3 text-emerald-900 dark:text-emerald-200 flex items-center">
                  <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Methodology
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Comprehensive systematic approach featuring structured data collection, 
                  rigorous statistical analysis, and peer-reviewed validation protocols 
                  ensuring reliable and reproducible results.
                </p>
              </div>
            </div>
          )}

          {mode === 'insights' && (
            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
              <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-200">Research Insights</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-gradient-to-b from-amber-400 to-yellow-400 pl-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-r-2xl shadow-sm">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center mb-2">
                    <LightBulbIcon className="w-5 h-5 mr-2" />
                    Key Innovation
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Novel approach to research methodology that introduces innovative 
                    techniques for data analysis and interpretation.
                  </p>
                </div>
                <div className="border-l-4 border-gradient-to-b from-emerald-400 to-green-400 pl-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-r-2xl shadow-sm">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center mb-2">
                    <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    Research Gap
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Identifies critical opportunities for future studies and highlights 
                    areas requiring additional investigation.
                  </p>
                </div>
                <div className="border-l-4 border-gradient-to-b from-purple-400 to-indigo-400 pl-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-r-2xl shadow-sm">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 flex items-center mb-2">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Impact Potential
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    High potential for real-world applications with significant 
                    implications for industry practices and future research directions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIResearchAssistant; 