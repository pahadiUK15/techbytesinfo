import React, { useState, useEffect } from 'react';
import { 
  Users, Database, Key, CheckCircle, Smartphone, MapPin, 
  RefreshCw, TrendingUp, DollarSign, Eye, EyeOff, Calendar, 
  Activity, ShieldAlert, CheckSquare, MessageSquare, Compass, ClipboardList, LogIn, Lightbulb, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceBooking, MockOrder, Suggestion } from '../types';
import TicketingTool from './TicketingTool';

interface AdminPanelProps {
  onRefreshTrigger?: number;
  currentUser?: { username: string; role: 'user' | 'admin' } | null;
  onSetCurrentUser?: (user: { username: string; role: 'user' | 'admin' } | null) => void;
}

export default function AdminPanel({ onRefreshTrigger, currentUser, onSetCurrentUser }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return currentUser?.role === 'admin';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // High-Security 2FA States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [simulatedMailCode, setSimulatedMailCode] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(currentUser?.role === 'admin');
  }, [currentUser]);

  // Loaded database indices
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [notifLogs, setNotifLogs] = useState<{ id: string; to: string; message: string; timestamp: string }[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activePane, setActivePane] = useState<'bookings' | 'orders' | 'logs' | 'suggestions' | 'tickets'>('bookings');
  
  // Engineer assignment action modal
  const [editingBooking, setEditingBooking] = useState<ServiceBooking | null>(null);
  const [engineerName, setEngineerName] = useState('Rajesh Kumar');
  const [engineerPhone, setEngineerPhone] = useState('9911994766');
  const [serviceStatus, setServiceStatus] = useState<any>('assigned');
  const [reportSummary, setReportSummary] = useState('');
  const [signatureCapture, setSignatureCapture] = useState('');

  // Fetch metrics data from administrative side
  const loadAdminMetrics = async () => {
    try {
      const headers = {
        'x-admin-session': 'Pahadi@9310UK#$%'
      };
      const bookRes = await fetch('/api/bookings', { headers });
      if (bookRes.ok) setBookings(await bookRes.json());

      const ordRes = await fetch('/api/orders', { headers });
      if (ordRes.ok) setOrders(await ordRes.json());
      
      const logRes = await fetch('/api/notifications', { headers });
      if (logRes.ok) setNotifLogs(await logRes.json());

      const sugRes = await fetch('/api/suggestions', { headers });
      if (sugRes.ok) setSuggestions(await sugRes.json());
    } catch (error) {
      console.error('Error fetching admin panels insights', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminMetrics();
    }
  }, [isAuthenticated, onRefreshTrigger]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsRequestingOtp(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        if (onSetCurrentUser) {
          onSetCurrentUser({ username: data.username, role: 'admin' });
        }
        setUsername('');
        setPassword('');
        setLoginError('');
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Incorrect administrator credentials. Please check your username and password.');
      }
    } catch (err) {
      setLoginError('Server error during admin login verification. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-session': 'Pahadi@9310UK#$%'
        },
        body: JSON.stringify({
          status: serviceStatus,
          engineerName,
          engineerPhone,
          serviceReportSummary: reportSummary || undefined,
          customerSignature: signatureCapture || undefined
        })
      });

      if (res.ok) {
        setEditingBooking(null);
        setReportSummary('');
        setSignatureCapture('');
        loadAdminMetrics(); // reload
      }
    } catch (error) {
      console.error('Failed modifying engineering details', error);
    }
  };

  // Math metrics sums
  const totalRevenue = orders.reduce((acc, current) => {
    return acc + (current.status === 'approved' || current.status === 'delivered' ? current.totalPrice : 0);
  }, 145000 + 48000); // include seed pricing defaults for display layout

  const activeTickets = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;

  return (
    <div className="py-12 bg-slate-50 min-h-screen border-t border-slate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto relative mt-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6.5">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <Database className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Tech Bytes Secure Access</h2>
                <p className="text-xs text-slate-500 font-mono">AUTHORIZED SYSTEMS ENGINE ONLY</p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 text-xs text-red-800 font-semibold text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Admin Password PIN</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g., 9911 or admin"
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isRequestingOtp}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isRequestingOtp ? 'Authenticating Admin...' : 'Authenticate & Log In'}
                  </button>
                </div>

                <div className="flex bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 font-mono items-start gap-2">
                  <Info className="w-4 h-4 text-slate-600 flex-none mt-0.5" />
                  <span>Enterprise Access Notice: Use administrator credentials. Unauthorized connection attempts are logged automatically.</span>
                </div>

              </form>

            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Upper metrics deck */}
            <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8.5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Security Level: Authorized administrator</span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mt-1">Tech Bytes Control Center</h2>
                  <p className="text-xs text-slate-500 mt-1.5 font-bold">Gurgaon Area Operations Database</p>
                </div>
                <div className="flex gap-2">
                  <button
                    id="btn-admin-refresh"
                    onClick={loadAdminMetrics}
                    className="inline-flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer"
                    title="Reload data metrics"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                  </button>
                  <button
                    id="btn-admin-logout"
                    onClick={() => {
                      setIsAuthenticated(false);
                      if (onSetCurrentUser) {
                        onSetCurrentUser(null);
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 cursor-pointer"
                  >
                    Logout Administrator
                  </button>
                </div>
              </div>

              {/* Stats bento rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Active support Tickets</span>
                    <span className="text-2xl font-extrabold text-[#1E40AF] block mt-1">{activeTickets} Tickets</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Total revenue scale</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Logged orders size</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{orders.length} Submissions</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Notification Alerts Log</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{notifLogs.length} Records</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Client Suggestions</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{suggestions.length} Ideas</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                </div>

              </div>

            </div>

            {/* Lower segment tab content togglers */}
            <div className="flex border-b border-slate-200">
              {['bookings', 'orders', 'tickets', 'logs', 'suggestions'].map((pane) => (
                <button
                  key={pane}
                  id={`btn-admin-pane-change-${pane}`}
                  onClick={() => setActivePane(pane as any)}
                  className={`px-6 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activePane === pane 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {pane === 'bookings' 
                    ? 'Service Bookings' 
                    : pane === 'orders' 
                    ? 'Products & Licenses Orders' 
                    : pane === 'tickets'
                    ? 'Tech Bytes Ticket Tool'
                    : pane === 'logs' 
                    ? 'WhatsApp API logs' 
                    : 'Client Suggestions'}
                </button>
              ))}
            </div>

            {/* PANE CONTENT BLOCKS */}
            <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm overflow-x-auto">
              
              {activePane === 'bookings' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    Active Onsite Support Requests & GPS Location Data
                  </h3>
                  
                  <div className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <div key={b.id} className="py-5.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        
                        {/* Summary details */}
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-bold text-slate-900">{b.fullName}</span>
                            {b.companyName && <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{b.companyName}</span>}
                            <span className="text-[10px] font-mono font-bold text-blue-800 uppercase bg-blue-50 px-2 py-0.5 rounded-full">{b.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              b.priority === 'emergency' ? 'bg-red-100 text-red-800' : b.priority === 'high' ? 'bg-orange-100 text-orange-850' : 'bg-slate-100 text-slate-700'
                            }`}>{b.priority}</span>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                              b.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>{b.status}</span>
                          </div>
                          
                          {/* Main Contact info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 font-semibold">
                            <span>Phone: <strong>{b.mobileNumber}</strong></span>
                            <span>WhatsApp: <strong>{b.whatsAppNumber}</strong></span>
                            <span>Address: <strong className="text-slate-700">{b.address}, {b.city}, {b.state} (PIN: {b.pinCode})</strong></span>
                            <span>Device Issue: <strong className="text-blue-600">{b.deviceType}</strong></span>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-medium">
                            <h5 className="font-bold text-slate-700 mb-0.5">Problem Log (500 words capacity limit):</h5>
                            {b.problemDescription}
                          </div>

                          {b.engineerName && (
                            <div className="flex gap-2 items-center text-xs text-slate-600 font-semibold bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg w-max">
                              <Compass className="w-4 h-4 text-emerald-600" />
                              <span>Assigned Engineer: <strong>{b.engineerName}</strong> | status tracking triggers enroute live</span>
                            </div>
                          )}

                        </div>

                        {/* Assign engineer controls */}
                        <div className="flex-none">
                          <button
                            id={`btn-admin-assign-${b.id}`}
                            onClick={() => {
                              setEditingBooking(b);
                              setServiceStatus(b.status);
                              setEngineerName(b.engineerName || 'Rajesh Kumar');
                              setEngineerPhone(b.engineerPhone || '9911994766');
                            }}
                            className="inline-flex items-center justify-center px-3.5 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Assign / status Update
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePane === 'orders' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    <Database className="w-5 h-5 text-indigo-600 mr-2" />
                    Product Cart Orders & Software Licensing Requests
                  </h3>
                  
                  <div className="divide-y divide-slate-100 text-xs">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 font-bold">{ord.customerName}</strong>
                            <span className="text-[11px] text-slate-400">({ord.customerEmail})</span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{ord.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ord.itemType === 'product' ? 'bg-blue-50 text-blue-800' : 'bg-indigo-50 text-indigo-850'
                            }`}>{ord.itemType}</span>
                          </div>
                          
                          <div className="text-slate-500 font-semibold space-y-0.5">
                            <p>Contact Phone: <strong>{ord.customerPhone}</strong></p>
                            <p>Item Ordered: <strong className="text-slate-800">{ord.itemName}</strong> (Qty: {ord.quantity})</p>
                          </div>
                        </div>

                        <div className="text-right sm:flex-none">
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Quote</span>
                          <strong className="text-sm font-extrabold text-blue-600 block">₹{ord.totalPrice.toLocaleString('en-IN')}</strong>
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 block mt-1">Pending callback review</span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePane === 'logs' && (
                <div className="space-y-4">
                  
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600 flex-none" />
                    <div>
                      <strong className="block text-slate-800 font-bold mb-0.5">Direct WhatsApp Notification Desk</strong>
                      This dashboard records all automated alerts sent to <strong className="text-slate-800">9911994766</strong> dynamically. Users also receive manual redirect buttons to trigger true physical chat submissions.
                    </div>
                  </div>

                  <div className="divide-y divide-slate-150 font-mono text-xs">
                    {notifLogs.map((log) => (
                      <div key={log.id} className="py-3.5 space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Target: <strong className="text-slate-600">+{log.to}</strong></span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="p-3 bg-slate-900 text-green-400 rounded-xl leading-relaxed">
                          {log.message}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {activePane === 'suggestions' && (
                <div className="space-y-6">
                  
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-xs text-amber-900 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-none" />
                    <div>
                      <strong className="block text-slate-800 font-bold mb-0.5">Interactive Client Suggestions Console</strong>
                      Review suggestions submitted by clients about website layout improvements, branding ideas, service additions, and hardware catalog requests below.
                    </div>
                  </div>

                  {suggestions.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-xs font-semibold">
                      No client suggestions logged in database yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestions.map((sug) => {
                        let catBadge = 'bg-slate-100 text-slate-700';
                        if (sug.category === 'website') catBadge = 'bg-blue-100 text-blue-800 border-blue-200';
                        else if (sug.category === 'service') catBadge = 'bg-emerald-100 text-emerald-850 border-emerald-200';
                        else if (sug.category === 'product_request') catBadge = 'bg-purple-100 text-purple-800 border-purple-200';
                        else if (sug.category === 'other') catBadge = 'bg-amber-100 text-amber-800 border-amber-200';

                        return (
                          <div 
                            key={sug.id} 
                            className="p-5 bg-slate-50 hover:bg-slate-50/85 border border-slate-200 rounded-2xl space-y-3 relative overflow-hidden transition-all"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-slate-800 text-xs block">{sug.authorName}</span>
                                {sug.email && (
                                  <span className="text-[10px] text-slate-500 font-mono font-semibold block select-all">
                                    {sug.email}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${catBadge}`}>
                                {sug.category.replace('_', ' ')}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-semibold h-20 overflow-y-auto pr-1 bg-white p-2.5 rounded-xl border border-slate-150">
                              "{sug.content}"
                            </p>

                            <div className="text-[9px] text-slate-400 font-mono text-right font-semibold">
                              Submitted: {new Date(sug.createdAt).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {activePane === 'tickets' && (
                <div className="space-y-4">
                  <TicketingTool currentUser={{ username: 'syalana', role: 'admin' }} />
                </div>
              )}

            </div>

            {/* Editing Booking Modal overlay */}
            <AnimatePresence>
              {editingBooking && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden w-full max-w-lg"
                  >
                    
                    {/* Header */}
                    <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Assigned tracking update</span>
                        <h3 className="text-base font-bold">Manage support Ticket: {editingBooking.id}</h3>
                      </div>
                      <button
                        onClick={() => setEditingBooking(null)}
                        className="text-white hover:text-slate-300 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleUpdateBooking} className="p-6 space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 gap-3">
                        
                        {/* Assign Engineer Options */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assign Field Engineer</label>
                          <select
                            value={engineerName}
                            onChange={(e) => {
                              setEngineerName(e.target.value);
                              if (e.target.value === 'Rajesh Kumar') setEngineerPhone('9911994766');
                              else if (e.target.value === 'Amit Sharma') setEngineerPhone('9811122334');
                              else setEngineerPhone('7065464766');
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                          >
                            <option value="Rajesh Kumar">Rajesh Kumar (+91 9911994766)</option>
                            <option value="Amit Sharma">Amit Sharma (+91 9811122334)</option>
                            <option value="Siddharth Singh">Siddharth Singh (+91 7065464766)</option>
                          </select>
                        </div>

                        {/* Status dropdown */}
                        <div>
                          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">SLA status Tracking</label>
                          <select
                            value={serviceStatus}
                            onChange={(e) => setServiceStatus(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none font-bold"
                          >
                            <option value="submitted">Submitted (Waiting confirmation)</option>
                            <option value="assigned">Assigned (Technician queue)</option>
                            <option value="en_route">En Route (Live traveling)</option>
                            <option value="checked_in">Checked-In (Onsite diagnostic working)</option>
                            <option value="completed">Completed (Digital signature uploaded)</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Report logs if completed */}
                        {serviceStatus === 'completed' && (
                          <div className="space-y-3 pt-3.5 border-t border-slate-100">
                            
                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Field Service Report Summary</label>
                              <textarea
                                required
                                rows={3}
                                value={reportSummary}
                                onChange={(e) => setReportSummary(e.target.value)}
                                placeholder="Detail diagnostic parameters fixed, components replaced, or licenses activated."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Customer Digital Signature Capture</label>
                              <input
                                type="text"
                                required
                                value={signatureCapture}
                                onChange={(e) => setSignatureCapture(e.target.value)}
                                placeholder="Type Client Name for signature authorization..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono italic"
                              />
                            </div>

                          </div>
                        )}

                      </div>

                      {/* Modal Footer actions */}
                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setEditingBooking(null)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Update Ticket Info
                        </button>
                      </div>

                    </form>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
}
