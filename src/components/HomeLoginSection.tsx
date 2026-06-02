import React, { useState } from 'react';
import { User, ShieldCheck, Lock, Unlock, Key, CheckCircle, Info } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface HomeLoginSectionProps {
  currentUser: { username: string; role: 'user' | 'admin' } | null;
  onSetCurrentUser: (user: { username: string; role: 'user' | 'admin' } | null) => void;
  onNavigateToServices?: () => void;
  onNavigateToStore?: () => void;
}

export default function HomeLoginSection({ 
  currentUser, 
  onSetCurrentUser, 
  onNavigateToServices,
  onNavigateToStore
}: HomeLoginSectionProps) {
  const [activePortal, setActivePortal] = useState<'user' | 'admin'>('user');
  
  // User Login States
  const [userVal, setUserVal] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState(false);

  // Admin Login States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isRequestingLogin, setIsRequestingLogin] = useState(false);

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    if (!userVal.trim()) {
      setUserError('Name is required.');
      return;
    }
    // Any username is fine, or simple checking. Let's make it robust!
    const capitalizedUser = userVal.charAt(0).toUpperCase() + userVal.slice(1);
    onSetCurrentUser({ username: capitalizedUser, role: 'user' });
    setUserSuccess(true);
    // Auto clear
    setUserVal('');
    setUserPass('');
    setTimeout(() => {
      setUserSuccess(false);
    }, 4000);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsRequestingLogin(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUser, password: adminPass })
      });

      if (response.ok) {
        const data = await response.json();
        onSetCurrentUser({ username: data.username, role: 'admin' });
        // Reset states
        setAdminPass('');
        setAdminUser('');
        setAdminError('');
      } else {
        const data = await response.json();
        setAdminError(data.error || 'Incorrect administrator credentials. Please check your username and password.');
      }
    } catch (err) {
      setAdminError('Server error during admin login verification. Please try again.');
    } finally {
      setIsRequestingLogin(false);
    }
  };

  const handleLogout = () => {
    onSetCurrentUser(null);
    setUserError('');
    setAdminError('');
  };

  return (
    <section id="login-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Visual left bar with login info */}
          <div className="md:col-span-4 bg-slate-900 p-8 text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#1E40AF]-light text-blue-400 font-bold block">
                Membership Gate
              </span>
              <h3 className="text-xl font-bold tracking-tight">Access Tech Bytes</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Logging in unlocks corporate priority pricing, allows onsite repair scheduling, and secures licensed cloud asset catalogs instantly.
              </p>
            </div>

            <div className="space-y-2.5 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-none" />
                <span>Active SLA Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-none" />
                <span>Quotations Management</span>
              </div>
              {currentUser && (
                <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20 mt-4">
                  <span className="text-[9px] uppercase font-mono text-blue-300 block">Logged In Status</span>
                  <span className="text-xs font-bold block mt-1">
                    {currentUser.role === 'admin' ? '🛡️ syalana (Admin)' : `👤 ${currentUser.username}`}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold mt-2.5 block text-left cursor-pointer"
                  >
                    Logout Session
                  </button>
                </div>
              )}
            </div>

            {/* Subtle grid elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          </div>

          {/* Actual Login Interaction Form */}
          <div className="md:col-span-8 p-8 sm:p-10.5">
            {currentUser ? (
              <div className="space-y-6 text-center py-6">
                <div className="w-12 h-12 bg-blue-50 text-[#1E40AF] rounded-full flex items-center justify-center mx-auto border border-blue-100 mb-2">
                  <Unlock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-slate-900">
                    Welcome back, {currentUser.username}!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    You are signed in as a <span className="text-blue-600 font-bold capitalize">{currentUser.role}</span>. 
                    {currentUser.role === 'admin' 
                      ? " You have edit access enabled for all hardware costs and licensing rates in the catalog."
                      : " You can now order devices, purchase licenses, and register onsite support inquiries."}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={onNavigateToStore}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Manage Store Prices
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={onNavigateToStore}
                        className="px-5 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Explore Store Catalog
                      </button>
                      <button
                        onClick={onNavigateToServices}
                        className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Book IT Service
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 border border-red-200 text-red-650 hover:bg-red-50 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Logout Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6.5">
                
                {/* Tab layout selector */}
                <div className="flex border-b border-slate-200 p-1 bg-slate-50 rounded-xl max-w-xs">
                  <button
                    onClick={() => setActivePortal('user')}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activePortal === 'user'
                        ? 'bg-white text-[#1E40AF] shadow-sm font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 inline mr-1.5" />
                    User Login
                  </button>
                  <button
                    onClick={() => setActivePortal('admin')}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activePortal === 'admin'
                        ? 'bg-slate-900 text-white shadow-sm font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 animate-pulse text-amber-500" />
                    Admin Login
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activePortal === 'user' ? (
                    <form onSubmit={handleUserLogin} className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900">User Client Session Portal</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          Log in to unlock orders, shopping cart features, and SLA onsite ticket requests instantly.
                        </p>
                      </div>

                      {userError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-800 font-semibold text-center">
                          {userError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Samir Verma"
                            value={userVal}
                            onChange={(e) => setUserVal(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Local Password PIN (Optional)
                          </label>
                          <input
                            type="password"
                            placeholder="Type any password"
                            value={userPass}
                            onChange={(e) => setUserPass(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          Log In Securely
                        </button>
                      </div>
                      
                      <div className="flex bg-blue-50/50 p-3 rounded-xl border border-blue-50 text-[10px] text-slate-500 font-mono items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 flex-none mt-0.5" />
                        <span>Instant Access Mode: Enter any customer name of your choice to immediately log in as a Client and order hardware or register certified engineer diagnostics.</span>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900">Owner & Administrator Secure Terminal</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          Requires highly classified cryptographic credentials. Only authorized owners have catalog pricing edit privileges.
                        </p>
                      </div>

                      {adminError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-800 font-semibold text-center">
                          {adminError}
                        </div>
                      )}

                      <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Owner Username
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Authorized user"
                              value={adminUser}
                              onChange={(e) => setAdminUser(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 font-semibold text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Private Security Password
                            </label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={adminPass}
                              onChange={(e) => setAdminPass(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 font-semibold text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isRequestingLogin}
                            className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <Key className="w-4 h-4 mr-2" />
                            {isRequestingLogin ? 'Verifying Credentials...' : 'Authenticate & Log In'}
                          </button>
                        </div>

                        <div className="flex bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 font-mono items-start gap-2">
                          <Info className="w-4 h-4 text-slate-600 flex-none mt-0.5" />
                          <span>Enterprise Access Notice: Use administrator credentials. Unauthorized connection attempts are logged automatically.</span>
                        </div>
                      </form>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
