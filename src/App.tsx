import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesList from './components/ServicesList';
import StoreCatalog from './components/StoreCatalog';
import Troubleshooter from './components/Troubleshooter';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import HomeLoginSection from './components/HomeLoginSection';
import SuggestionsBox from './components/SuggestionsBox';
import TicketingTool from './components/TicketingTool';
import { ShieldCheck, MapPin, Award, Phone, Mail, Clock, MessageSquare, CheckCircle, Database, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'user' | 'admin' } | null>(() => {
    try {
      const persisted = localStorage.getItem('techbytes_session');
      return persisted ? JSON.parse(persisted) : null;
    } catch {
      return null;
    }
  });

  const adminLoggedIn = currentUser?.role === 'admin';
  const [refreshAdminTracker, setRefreshAdminTracker] = useState<number>(0);

  // Prefilled states for automated ticket creation from AI agent diagnosis
  const [prefilledTitle, setPrefilledTitle] = useState('');
  const [prefilledDescription, setPrefilledDescription] = useState('');

  const handleLoginSession = (user: { username: string; role: 'user' | 'admin' } | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('techbytes_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('techbytes_session');
    }
  };

  const handleBookingComplete = () => {
    // Increment tracker to automatically reload admin statistics
    setRefreshAdminTracker(prev => prev + 1);
  };

  const handleSelectBookingCategory = (categoryTitle: string) => {
    setPrefilledTitle(categoryTitle);
    setPrefilledDescription(`Onsite IT consultation requested regarding: ${categoryTitle}. Please coordinate certified support engineer visit.`);
    setActiveTab('book');
  };

  const handleAutoCreateTicketFromDiag = (title: string, description: string) => {
    setPrefilledTitle(title);
    setPrefilledDescription(description);
    setActiveTab('book');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={adminLoggedIn} 
        onLogoutAdmin={() => {
          handleLoginSession(null);
          setActiveTab('home');
        }} 
      />

      {/* Main Content frame */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            
            {activeTab === 'home' && (
              <div className="space-y-16">
                
                {/* Showcase block */}
                <Hero 
                  onBookNow={() => {
                    setPrefilledTitle('');
                    setPrefilledDescription('');
                    setActiveTab('book');
                  }} 
                  onExploreServices={() => setActiveTab('store')} 
                />

                {/* Corporate Trust highlights */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="bg-white p-6.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1E40AF] flex items-center justify-center border border-blue-100">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">Enterprise Safety Guaranteed</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Every diagnostic visit of our certified technician follows secure anti-wear guidelines. We use original hardware parts backed by Dell, Lenovo, & HP brand policies.
                      </p>
                    </div>

                    <div className="bg-white p-6.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">SLA-Driven Dispatch</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        We respect your focus. Choose our high or emergency priority brackets for SLA responses under 2-4 hours strictly inside Gurgaon regional business complexes.
                      </p>
                    </div>

                    <div className="bg-white p-6.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">First Support Visit Free</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Is your administrative PC stuck on credential loop? No worries. Sign up your corporate enterprise (3+ computers) to receive your initial onsite IT service 100% free.
                      </p>
                    </div>

                  </div>
                </section>

                {/* Compact Gurgaon geographical map visual showcase */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                  <div className="p-8 sm:p-10.5 rounded-2xl bg-slate-900 text-white relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-slate-800">
                    
                    <div className="space-y-5 relative z-10">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Gurgaon Local Presence
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Gurugram-Central IT Helpdesk Team</h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
                        To maintain the highest quality and lightning-fast dispatch times, Tech Bytes operates exclusively inside Gurgaon, Haryana area. All remote monitoring, diagnostic visits, and component warranties are governed here.
                      </p>
                      
                      <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs text-slate-300 font-semibold font-mono">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500 flex-none" />
                          <span>Sector 47, Gurgaon, Haryana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-500 flex-none" />
                          <span>+91 9911994766</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Map graphic */}
                    <div className="relative h-60 w-full rounded-xl bg-slate-800/80 overflow-hidden border border-slate-700/80 flex flex-col justify-between p-4 font-mono text-[10px]">
                      
                      <div className="flex justify-between items-center text-slate-500 uppercase font-semibold">
                        <span>Gurugram Dispatch Radar</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> Online</span>
                      </div>

                      <div className="space-y-2 pr-6">
                        <p className="text-green-400 font-bold">Tech Bytes Engineers Status:</p>
                        <p className="text-slate-300">● Rajesh Kumar: Dispatch DLF Cyber City (SLA 4h Active)</p>
                        <p className="text-slate-300">● Amit Sharma: Operational Desk Sohna Road (Checked in)</p>
                        <p className="text-slate-300">● Siddharth Singh: Parts coordination Sector 47</p>
                      </div>

                      <div className="text-slate-500 text-[9px] text-right">
                        <span>LAT: 28.4595° N | LNG: 77.0266° E</span>
                      </div>

                      {/* Map lines decorations */}
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] -z-0 pointer-events-none" />

                    </div>

                  </div>
                </section>
                
                {/* Authentic Dual-Portal Login System */}
                <HomeLoginSection 
                  currentUser={currentUser}
                  onSetCurrentUser={handleLoginSession}
                  onNavigateToServices={() => setActiveTab('services')}
                  onNavigateToStore={() => setActiveTab('store')}
                />

              </div>
            )}

            {activeTab === 'services' && (
              <ServicesList onSelectBookingCategory={handleSelectBookingCategory} />
            )}

            {activeTab === 'store' && (
              <StoreCatalog 
                currentUser={currentUser}
                onSetCurrentUser={handleLoginSession}
              />
            )}

            {activeTab === 'ai-desk' && (
              <Troubleshooter onAutoCreateTicket={handleAutoCreateTicketFromDiag} />
            )}

            {activeTab === 'helpdesk' && (
              <TicketingTool 
                currentUser={currentUser}
                onNavigateToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'book' && (
              <BookingForm 
                prefilledTitle={prefilledTitle} 
                prefilledDescription={prefilledDescription} 
                onBookingSuccess={handleBookingComplete} 
                currentUser={currentUser}
                onSetCurrentUser={handleLoginSession}
              />
            )}

            {activeTab === 'suggestions' && (
              <SuggestionsBox currentUser={currentUser} />
            )}

            {activeTab === 'admin' && (
              <AdminPanel 
                onRefreshTrigger={refreshAdminTracker} 
                currentUser={currentUser}
                onSetCurrentUser={handleLoginSession}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Footprint block */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8.5">
          
          {/* Brand Frame */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-[#1E40AF] rounded flex items-center justify-center shadow-md">
                <div className="w-6 h-6 border-t-2 border-r-2 border-white"></div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight uppercase block leading-none">Tech Bytes</span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 mt-1 block">Your Trusted IT Partner</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm font-semibold">
              "Reliable IT Support. Stronger Business." Your trustworthy regional service partner for secure cloud installations, hardware speedups, configurations and AI system modernizations.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Solutions Portal</h4>
            <div className="grid grid-cols-1 gap-2.5 font-semibold">
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('services')}>Helpdesk Support</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('services')}>Microsoft 365 Cloud</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('store')}>Software & Licenses</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('ai-desk')}>AI Agent Desk</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('book')}>Register Support Inquiry</span>
            </div>
          </div>

          {/* Core contact rules */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Gurugram Administrative Core</h4>
            <div className="space-y-3 font-semibold text-slate-400">
              
              <div className="flex gap-2">
                <MapPin className="w-4.5 h-4.5 text-blue-500 flex-none mt-0.5" />
                <span>Tech Bytes Desk, Sector 47, Gurgaon, Haryana, PIN 122002</span>
              </div>

              <div className="flex gap-2">
                <Phone className="w-4.5 h-4.5 text-emerald-500 flex-none mt-0.5" />
                <div>
                  <p>Tajveer Support: <a href="tel:9911994766" className="text-white font-bold hover:text-emerald-400 font-mono">+91 9911994766</a></p>
                  <p className="text-slate-500 text-[10px]">Primary notification line and WhatsApp core</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Mail className="w-4.5 h-4.5 text-blue-400 flex-none mt-0.5" />
                <span>Executive Mail Desk: <a href="mailto:techbytes2024@gmail.com" className="text-white hover:text-blue-400">techbytes2024@gmail.com</a></span>
              </div>

            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-slate-500 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-mono tracking-widest gap-4">
          <span>© 2026 Tech Bytes Helpdesk Systems of Gurgaon. All Rights Reserved.</span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-white" onClick={() => setActiveTab('admin')}>
            <Database className="w-3.5 h-3.5 text-blue-500" /> Admin Access Area
          </span>
        </div>
      </footer>

    </div>
  );
}
