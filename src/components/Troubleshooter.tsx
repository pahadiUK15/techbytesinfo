import React, { useState, useRef } from 'react';
import { 
  Terminal, ShieldCheck, Sparkles, Image, CheckCircle, 
  AlertTriangle, Play, RefreshCw, FileImage, Cpu, Laptop, RefreshCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DiagnosticResult } from '../types';

interface TroubleshooterProps {
  onAutoCreateTicket: (title: string, description: string) => void;
}

export default function Troubleshooter({ onAutoCreateTicket }: TroubleshooterProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'screenshot'>('chat');
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null);

  // Screenshot states
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-loaded high fidelity error templates for quick testing
  const dummyErrors = [
    {
      name: 'Windows BSOD Error',
      img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&auto=format&fit=crop&q=60',
      desc: 'System panic with KERNEL_SECURITY_CHECK_FAILURE code.',
      mockBase64: 'bsod_dummy_file_stream'
    },
    {
      name: 'Printer Offline Spooler Exception',
      img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=100&auto=format&fit=crop&q=60',
      desc: 'Spooler crashed with unhandled queue error threads.',
      mockBase64: 'printer_dummy_file_stream'
    },
    {
      name: 'Outlook Credential Loop Loop',
      img: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=100&auto=format&fit=crop&q=60',
      desc: 'Repeatedly rejects authenticated Microsoft 365 passwords.',
      mockBase64: 'outlook_dummy_file_stream'
    }
  ];

  const handleTextDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setLoading(true);
    setDiagnosis(null);

    try {
      const res = await fetch('/api/gemini/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch (err) {
      console.error('Error analyzing terminal diagnostic query', err);
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setDiagnosis(null);

    try {
      const base64 = await convertFileToBase64(file);
      setScreenshotUri(base64);
      
      // Call endpoint
      const res = await fetch('/api/gemini/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: base64, mimeType: file.type })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch (error) {
      console.error('Failed reading and sending base64 file', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSelectMockError = async (mock: typeof dummyErrors[0]) => {
    setUploadLoading(true);
    setDiagnosis(null);
    setScreenshotUri(mock.img);

    try {
      const res = await fetch('/api/gemini/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Mock diagnosis for photo: ${mock.name}. ${mock.desc}` })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch (err) {
      console.error('Mock error trigger error', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const triggerAutoOnsiteTicket = () => {
    if (!diagnosis) return;
    const desc = `AUTO-TICKET DIAGNOSED BY TECH BYTES AI\n\nDetected Issue: ${diagnosis.detectedIssue}\n\nExplanation: ${diagnosis.explanation}\n\nSuggested Resolution Logs:\n${diagnosis.steps.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\nDevice Class: ${diagnosis.recommendedCategory}`;
    onAutoCreateTicket(diagnosis.detectedIssue, desc);
  };

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Header area */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 text-xs font-bold text-[#1E40AF] bg-blue-50 border border-blue-100 rounded-full mb-3 uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#1E40AF] mr-1 pb-0.5 animate-spin inline-block" />
            Empowered by Gemini AI Diagnostic Engine
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Tech Bytes Diagnostic Desk</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-semibold">
            Troubleshoot system blockages, network drops, licensing crashes, or upload snapshots of BSOD/Outlook loops for immediate expert step-by-step resolution rules.
          </p>
        </div>

        {/* Sub-tab chooser */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <button
            id="btn-diag-tab-chat"
            onClick={() => { setActiveTab('chat'); setDiagnosis(null); setScreenshotUri(null); }}
            className={`px-4.5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'chat' 
                ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/10' 
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
            AI Troubleshooter Agent
          </button>
          <button
            id="btn-diag-tab-screenshot"
            onClick={() => { setActiveTab('screenshot'); setDiagnosis(null); setScreenshotUri(null); }}
            className={`px-4.5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'screenshot' 
                ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/10' 
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Image className="w-3.5 h-3.5 inline mr-1.5" />
            Screenshot Image Diagnosis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main workspace section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              
              {activeTab === 'chat' ? (
                <form onSubmit={handleTextDiagnostic} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Describe System or Software Error
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="e.g., MacBook keeps rebooting with folder logo with question mark / Printer queue is stuck in offline state causing administrative blocks..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1E40AF] focus:bg-white bg-slate-50 focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center px-4.5 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition-all disabled:opacity-50 cursor-pointer uppercase shadow-lg shadow-blue-900/10"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Consulting AI Engine...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
                          Initialize Diagnosis
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueryText('')}
                      className="px-4.5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-md cursor-pointer uppercase"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  
                  {/* File Upload zone */}
                  <div className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:border-[#1E40AF] hover:bg-blue-50/10 transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUploadChange}
                      accept="image/*"
                      className="hidden" 
                    />
                    
                    {screenshotUri ? (
                      <div className="space-y-3">
                        <div className="relative w-32 h-20 bg-slate-100 rounded mx-auto border border-slate-200">
                          <img src={screenshotUri} alt="User Upload Frame" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-[#1E40AF]">File attached successfully. Click to replace.</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="w-10 h-10 rounded bg-blue-50 text-[#1E40AF] flex items-center justify-center mx-auto border border-blue-100">
                          <FileImage className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="block text-xs font-bold text-slate-705 uppercase tracking-wide">Drag & Drop or Choose Error Screenshot</strong>
                          <span className="text-[10px] text-slate-400 font-semibold">Supports PNG, JPG (Max 5MB file sized captures)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preloaded test templates */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Sandbox Testing Templates:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {dummyErrors.map((dummy, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectMockError(dummy)}
                          className="flex sm:flex-col items-center gap-3 sm:gap-2 p-2.5 bg-white rounded-md border border-slate-200 hover:border-[#1E40AF] text-left sm:text-center transition-all cursor-pointer"
                        >
                          <img src={dummy.img} alt={dummy.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md flex-none" />
                          <span className="text-[11px] font-bold text-slate-800 leading-tight">{dummy.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* AI guidelines notice block */}
            <div className="p-4 rounded-md bg-white border border-slate-200 flex gap-3 text-xs text-slate-600 leading-relaxed shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#1E40AF] flex-none" />
              <div>
                <strong className="block font-bold text-slate-900 uppercase">Confidential & ISO Secured</strong>
                All diagnostic requests are analyzed server-side with strict isolation rules. User-sensitive PII or internal registry properties remain strictly private.
              </div>
            </div>

          </div>

          {/* Diagnosis output section */}
          <div className="lg:col-span-6 relative">
            <AnimatePresence mode="wait">
              {uploadLoading || loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 text-center space-y-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                >
                  <RefreshCcw className="w-8 h-8 text-[#1E40AF] animate-spin mx-auto" />
                  <div className="space-y-1">
                    <strong className="block text-sm font-bold text-slate-800 uppercase">Gemini AI Parsing crash logs...</strong>
                    <span className="text-xs text-slate-500 font-semibold">Checking hardware stack, driver errors, and licensing activation codes.</span>
                  </div>
                </motion.div>
              ) : diagnosis ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-md divide-y divide-slate-100"
                >
                  
                  {/* DIAGNOSIS TITLE BLOCK */}
                  <div className="p-5.5 space-y-1">
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                      Crash Diagnosis Report
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                      {diagnosis.detectedIssue}
                    </h3>
                  </div>

                  {/* ANALYSIS PARAGRAPH */}
                  <div className="p-5.5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">AI Technical Summary</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed font-semibold">
                      {diagnosis.explanation}
                    </p>
                  </div>

                  {/* STEP BY STEP STEPS */}
                  <div className="p-5.5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Step-By-Step Operational Recovery Logs</h4>
                    <ol className="space-y-2.5">
                      {diagnosis.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-650 leading-relaxed font-semibold">
                          <span className="w-5 h-5 rounded-md bg-blue-50 text-[#1E40AF] border border-blue-100 font-mono flex items-center justify-center flex-none font-bold">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* RECOMMENDATION BLOCK */}
                  <div className="p-5.5 bg-slate-50 space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Recommended replacement Hardware/Licenses</h4>
                    
                    <div className="space-y-2 text-xs">
                      {diagnosis.recommendedProducts && diagnosis.recommendedProducts.length > 0 && (
                        <div className="flex gap-2 items-center bg-white border border-slate-200 p-2.5 rounded-md font-semibold text-slate-700">
                          <Laptop className="w-4 h-4 text-[#1E40AF]" />
                          <span>Hardware Component: <strong className="text-slate-900">{diagnosis.recommendedProducts[0]}</strong></span>
                        </div>
                      )}
                      {diagnosis.recommendedLicenses && diagnosis.recommendedLicenses.length > 0 && (
                        <div className="flex gap-2 items-center bg-white border border-slate-200 p-2.5 rounded-md font-semibold text-slate-700">
                          <Cpu className="w-4 h-4 text-emerald-600" />
                          <span>Enterprise License: <strong className="text-slate-900">{diagnosis.recommendedLicenses[0]}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Ticket creation trigger */}
                    <div className="pt-2">
                      <button
                        id="btn-auto-ticket-create"
                        onClick={triggerAutoOnsiteTicket}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold shadow-lg shadow-blue-900/10 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Create Onsite support Ticket Instantly
                      </button>
                    </div>

                  </div>

                </motion.div>
              ) : (
                <div className="p-12 text-center space-y-3 border border-slate-200 bg-white rounded-xl h-80 flex flex-col justify-center shadow-sm">
                  <Terminal className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>
                    <strong className="block text-sm font-bold text-slate-700 uppercase">Diagnosis Dashboard Is Quiet</strong>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 font-semibold">
                      Input your device conflict query or drag and drop error photos to view remedial actions in real-time.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
