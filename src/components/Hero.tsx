import { Shield, Sparkles, MapPin, CheckCircle, ChevronRight, Phone, Mail, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onBookNow: () => void;
  onExploreServices: () => void;
}

export default function Hero({ onBookNow, onExploreServices }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] border-b border-slate-200 py-16 sm:py-20">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-1/2 left-0 -z-10 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl opacity-30 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Hero Content block */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Gurgaon Badge */}
            <div className="inline-block px-3 py-1 bg-blue-50 text-[#1E40AF] text-xs font-semibold rounded-full mb-2 border border-blue-100">
              ENTERPRISE-GRADE SOLUTIONS STRICTLY IN GURGAON, HARYANA
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-4 tracking-tight">
                Reliable IT Support.<br/><span className="text-[#1E40AF]">Stronger Business.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed mb-8">
                Serving Gurgaon, Haryana with premium Managed IT, AI Agent Development, and Cloud infrastructure solutions.
              </p>
            </div>

            {/* Bullets of Capability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0 text-left">
              {[
                { label: 'Onsite PC & Mac Support', desc: 'Fast certified dispatch', bg: 'bg-blue-100/50' },
                { label: 'Microsoft 365 Cloud AD', desc: 'Secure email & file suites', bg: 'bg-indigo-100/50' },
                { label: 'Cisco Routing & Firewalls', desc: 'CCNA/CCNP aligned designs', bg: 'bg-sky-100/50' },
                { label: 'Linux Servers Administration', desc: 'RHCSA level admin setups', bg: 'bg-emerald-100/50' },
                { label: 'AI Agents & Chat Automation', desc: 'Intelligent process workflows', bg: 'bg-purple-100/50' },
                { label: 'Licensed Software & Tools', desc: 'Instant authorized consultation', bg: 'bg-amber-100/50' }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white border border-slate-150 shadow-xs rounded-xl flex gap-3 items-center">
                  <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center text-slate-800 flex-none`}>
                    <div className="w-2 h-2 bg-[#1E40AF] rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action cluster */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                id="btn-hero-book"
                onClick={onBookNow}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#1E40AF] text-white rounded-md font-semibold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all cursor-pointer text-sm"
              >
                Book Onsite Service In Gurgaon
                <ChevronRight className="ml-1.5 w-4 h-4" />
              </button>
              <button
                id="btn-hero-explore"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-sm font-semibold rounded-md"
              >
                Browse Tech Store
              </button>
            </div>

          </div>

          {/* Right Promotion Card / Poster Representation */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Top Banner accent */}
              <div className="bg-[#1E40AF] px-6 py-5.5 text-white relative">
                <div className="absolute right-4 top-4 opacity-15">
                  <Award className="w-16 h-16" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-blue-100">Exclusively for Corporates</p>
                <h3 className="text-2xl font-bold tracking-tight mt-1">FIRST SERVICE FREE</h3>
                <p className="text-xs text-blue-100 mt-1.5 leading-snug">Conveyance charges may be applicable. Corporate apply only for 3+ PCs setup.</p>
              </div>

              {/* Contact Executives Column */}
              <div className="p-6 space-y-6">
                
                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Enterprise Contact Desk</h4>
                  <div className="space-y-3.5">
                    
                    <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E40AF] mr-3 flex-none">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Tajveer Singh</span>
                        <a href="tel:9911994766" className="block text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors">
                          +91 9911994766
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mr-3 flex-none">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Back-up Service Desk</span>
                        <a href="tel:7065464766" className="block text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                          +91 7065464766
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mr-3 flex-none">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Enterprise Mail Desk</span>
                        <a href="mailto:techbytes2024@gmail.com" className="block text-sm font-semibold text-slate-800 hover:text-teal-600 transition-colors">
                          techbytes2024@gmail.com
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Additional trust factors */}
                <div className="pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="flex gap-2 items-center">
                    <Sparkles className="w-5 h-5 text-amber-500 flex-none" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-none">Genuine Parts</span>
                      <span className="text-[10px] text-slate-500">Quality You Can Trust</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock className="w-5 h-5 text-blue-500 flex-none" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-none">Fast Response</span>
                      <span className="text-[10px] text-slate-500">Gurgaon Onsite Support</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
