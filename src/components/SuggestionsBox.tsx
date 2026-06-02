import React, { useState } from 'react';
import { Lightbulb, Send, MessageSquare, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuggestionsBoxProps {
  currentUser?: { username: string; role: 'user' | 'admin' } | null;
}

export default function SuggestionsBox({ currentUser }: SuggestionsBoxProps) {
  const [authorName, setAuthorName] = useState(currentUser?.username || '');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'website' | 'service' | 'product_request' | 'other'>('website');
  const [content, setContent] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorName: authorName.trim() || 'Anonymous Client',
          email: email.trim() || undefined,
          category,
          content: content.trim()
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setContent('');
        setEmail('');
        if (!currentUser) {
          setAuthorName('');
        }
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Failed to submit suggestion.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to reach the Tech Bytes database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[70vh] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title structure */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E40AF] border border-blue-150/40">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Interactive Client Suggestions Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Suggest Website Features & Service Offerings
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Apka feedback hamare liye behad zaroori hai! Ham is website aur digital service features me kya or sudhar (improve) kar sakte hain, ya aap koi custom product range chahte hain - niche likhkar hamen batayein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Detailed side explanation box */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6.5 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-bold tracking-tight">Kyun suggestion dein?</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Tech Bytes hamesha standard systems upgrade, licensing rates, aur field support accuracy ko improve karne ke prayash me rehta hai.
                </p>
              </div>

              <div className="space-y-4 font-semibold text-xs text-slate-300 relative z-10">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-none text-[10px]">1</div>
                  <p className="leading-relaxed">
                    <strong>New Services:</strong> Kisi khas virtual routing, Cisco switch setup, or firewall management ko shamil karwane ke liye riay dein.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-none text-[10px]">2</div>
                  <p className="leading-relaxed">
                    <strong>Catalog requests:</strong> Agar dukan me nayi type ka hardware ya laptop model dikhana chahte hain, to model name batayein.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center flex-none text-[10px]">3</div>
                  <p className="leading-relaxed">
                    <strong>Aapki Raksha:</strong> Suggestions automatically direct admin dashboard me hamare primary system managers ke pass notify ho jati hai.
                  </p>
                </div>
              </div>

              {/* Grid patterns decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            </div>

            {/* Quick alert */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-amber-900 flex gap-3 text-xs items-start">
              <span className="text-base">💡</span>
              <div className="space-y-1">
                <p className="font-bold">Privacy Security</p>
                <p className="text-[11px] text-amber-850 font-semibold leading-relaxed">
                  Suggestions are reviewed daily in the secure Admin Workspace Panel. Your recommendations are kept strictly confidential under data security regulations!
                </p>
              </div>
            </div>
          </div>

          {/* Actual Suggestions Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6.5 sm:p-8">
              
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 space-y-5"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Suggestion Submitted Safely!</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                        Aapka anmol sujhav (suggestion) database me surakshit save ho chuka hai. Tech Bytes Admins is par jald hi asar karenge! Thank you for helping us grow.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Give Another Suggestion
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#1E40AF]" />
                      Write Your Suggestion
                    </h3>

                    {errorMsg && (
                      <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-800 font-medium rounded-lg">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g., Rohan Gupta"
                          className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Email/Phone (Optional)
                        </label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g., rohan@company.com"
                          className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Suggestion Category *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        
                        <button
                          type="button"
                          onClick={() => setCategory('website')}
                          className={`p-3 border text-xs font-bold rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                            category === 'website'
                              ? 'border-blue-500 bg-blue-50/45 text-blue-900 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="block font-bold">💻 Website Layout</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">Design, pages suggestions</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategory('service')}
                          className={`p-3 border text-xs font-bold rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                            category === 'service'
                              ? 'border-blue-500 bg-blue-50/45 text-blue-900 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="block font-bold">🛠️ IT Service Range</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">Support SLA, new skills</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategory('product_request')}
                          className={`p-3 border text-xs font-bold rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                            category === 'product_request'
                              ? 'border-blue-500 bg-blue-50/45 text-blue-900 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="block font-bold">📦 Product Catalog</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">Request hardware & software</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategory('other')}
                          className={`p-3 border text-xs font-bold rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                            category === 'other'
                              ? 'border-blue-500 bg-blue-50/45 text-blue-900 shadow-sm'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="block font-bold">💡 Miscellaneous</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">General advice & ideas</span>
                        </button>

                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Describe What We Can Add or Improve *
                      </label>
                      <textarea
                        required
                        rows={5}
                        maxLength={1000}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Nayi service or website features jo aap chahte hain unke baare me batayein (maximum 1000 characters)..."
                        className="w-full px-3.5 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-blue-650 bg-[#1E40AF] hover:bg-blue-850 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Suggestion</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
