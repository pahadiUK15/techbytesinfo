import { Laptop, Phone, MessageSquare, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({ activeTab, setActiveTab, isAdmin, onLogoutAdmin }: NavbarProps) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'IT Services' },
    { id: 'store', label: 'Store & Licenses' },
    { id: 'ai-desk', label: 'AI Diagnostic Desk' },
    { id: 'helpdesk', label: 'Tech Bytes Ticketing Tool' },
    { id: 'book', label: 'Book Onsite Support' },
    { id: 'suggestions', label: 'Suggestion Box' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-[#1E40AF] rounded flex items-center justify-center flex-none">
              <div className="w-6 h-6 border-t-2 border-r-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1E40AF] leading-none uppercase">TECH BYTES</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5 font-semibold">Your Trusted IT Partner</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active ? 'text-[#1E40AF]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#1E40AF]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Contact Details & Quick Admin toggle */}
          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                  <Database className="w-3 h-3 mr-1" /> Admin Desk Active
                </span>
                <button
                  id="btn-logout-admin"
                  onClick={onLogoutAdmin}
                  className="px-5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-admin"
                onClick={() => setActiveTab('admin')}
                className={`hidden lg:inline-flex items-center px-5 py-2 rounded-md text-xs font-semibold transition-colors border cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-blue-50 border-blue-200 text-[#1E40AF]' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 mr-1" /> Admin Area
              </button>
            )}

            {/* Quick Phone Call Action */}
            <a
              href="tel:9911994766"
              className="inline-flex items-center justify-center p-2.5 rounded-lg bg-blue-50/70 hover:bg-blue-100/80 text-[#1E40AF] transition-colors"
              title="Call Tajveer Singh"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Quick WhatsApp Action */}
            <a
              href="https://wa.me/919911994766?text=Hi%20Tech%20Bytes,%20I%20am%20looking%20for%20premium%20IT%20support%20services."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
              title="WhatsApp Chat Support"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
