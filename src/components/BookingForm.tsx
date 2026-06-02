import React, { useState, useEffect } from 'react';
import { 
  MapPin, CheckCircle2, PhoneCall, Key, Compass, 
  MessageSquare, AlertCircle, Sparkles, LogIn, Upload, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceBooking, PriorityLevel } from '../types';

interface BookingFormProps {
  prefilledTitle?: string;
  prefilledDescription?: string;
  onBookingSuccess: () => void;
  currentUser?: { username: string; role: 'user' | 'admin' } | null;
  onSetCurrentUser?: (user: { username: string; role: 'user' | 'admin' } | null) => void;
}

export default function BookingForm({ 
  prefilledTitle, 
  prefilledDescription, 
  onBookingSuccess,
  currentUser,
  onSetCurrentUser
}: BookingFormProps) {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('122002');
  const [deviceType, setDeviceType] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  
  // Inline User login
  const [inlineLoginName, setInlineLoginName] = useState('');
  const [inlineLoginError, setInlineLoginError] = useState('');

  // GPS Coordinates Simulation states
  const [gpsSimulated, setGpsSimulated] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [pinValidationError, setPinValidationError] = useState('');

  // Response booking success tracker
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ id: string; redirectUrl: string } | null>(null);

  // Character limit for description (approximately 500 words is ~2500 - 3000 chars)
  const MAX_CHAR_COUNT = 3000;

  useEffect(() => {
    if (prefilledTitle) {
      setDeviceType(prefilledTitle);
    }
    if (prefilledDescription) {
      setProblemDescription(prefilledDescription);
    }
  }, [prefilledTitle, prefilledDescription]);

  useEffect(() => {
    if (currentUser?.role === 'user') {
      setFullName(currentUser.username);
    }
  }, [currentUser]);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineLoginName.trim()) {
      setInlineLoginError('Please enter your name.');
      return;
    }
    const capitalized = inlineLoginName.charAt(0).toUpperCase() + inlineLoginName.slice(1);
    if (onSetCurrentUser) {
      onSetCurrentUser({ username: capitalized, role: 'user' });
    }
    setFullName(capitalized);
    setInlineLoginError('');
  };

  // Handle GPS location auto-fill simulation (Gurgaon central coordination)
  const simulateGpsLocation = () => {
    setGpsSimulated(true);
    // Gurgaon CyberCity center
    const randomShiftLat = (Math.random() - 0.5) * 0.05;
    const randomShiftLng = (Math.random() - 0.5) * 0.05;
    setLatitude(28.4952 + randomShiftLat);
    setLongitude(77.0894 + randomShiftLng);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinValidationError('');

    // Adhere back strictly to Gurgaon Pin Codes validation (DLF, Cybercity, Sohna Road sectors)
    const numericPin = Number(pinCode);
    if (!pinCode.startsWith('122') || pinCode.length !== 6 || isNaN(numericPin)) {
      setPinValidationError('Tech Bytes strictly operates inside Gurgaon, Haryana region only. Please provide a valid Gurgaon sector PIN code starting with 122 (e.g. 122002, 122018).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          companyName,
          mobileNumber,
          whatsAppNumber,
          email,
          address,
          city: 'Gurgaon', // Gurgaon Haryana strictly
          state: 'Haryana',
          pinCode,
          deviceType,
          problemDescription,
          priority,
          preferredDate,
          preferredTime,
          screenshotUrl: ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBookingResult({
          id: data.booking.id,
          redirectUrl: data.directWhatsAppLink
        });
        
        // Callback home
        onBookingSuccess();

        // Clear local inputs
        setFullName('');
        setCompanyName('');
        setMobileNumber('');
        setWhatsAppNumber('');
        setEmail('');
        setAddress('');
        setDeviceType('');
        setProblemDescription('');
      }
    } catch (err) {
      console.error('Failed creating onsite ticket booking', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form header frame */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-mono font-bold text-[#1E40AF] uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded">
            Gurgaon Area Service Desk
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 uppercase">
            Book Certified Onsite Support
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 font-semibold">
            "Reliable IT Support. Stronger Business." - Delivered live to your business or home in Gurgaon.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          
          {/* Form wrapper */}
          {bookingResult ? (
            <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-150 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 animate-bounce text-emerald-600" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded uppercase">Ticket Assigned: {bookingResult.id}</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Onsite IT visit Registered!</h3>
                <p className="text-xs text-slate-500 max-w-lg mx-auto font-semibold">
                  Your ticket has been written to the Tech Bytes Gurgaon database. An engineer is queueing for dispatch.
                </p>
              </div>

              {/* Requirement: "isme whatsapp 9911994766 me koi bhi user agar service book kare to is number par mere ko notification mil jaye" */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-md max-w-md mx-auto space-y-4">
                <div className="flex gap-2.5 text-left text-xs text-slate-650 leading-relaxed font-semibold">
                  <AlertCircle className="w-5 h-5 text-[#1E40AF] mt-0.5 flex-none" />
                  <div>
                    <strong className="text-slate-900 uppercase block text-[10px] tracking-wide mb-1">Direct WhatsApp trigger ready:</strong> Our server generated a booking brief. Click below to immediately send the details straight to Tajveer Singh's WhatsApp number <strong className="text-slate-900 font-bold">9911994766</strong>!
                  </div>
                </div>

                <a
                  href={bookingResult.redirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-750 text-white text-xs font-bold rounded-md shadow-md transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notify Tajveer Support on WhatsApp Live
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setBookingResult(null)}
                  className="border border-[#1E40AF] text-[#1E40AF] hover:bg-blue-50/50 px-5 py-2.5 rounded-md text-xs font-semibold cursor-pointer uppercase tracking-wider"
                >
                  Book Another Support Visit
                </button>
              </div>

            </div>
          ) : !currentUser ? (
            /* User session is required to register support ticket */
            <div className="p-8 text-center space-y-5 py-12">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 mb-2">
                <Lock className="w-6 h-6 animate-pulse animate-duration-1000" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900 uppercase text-center">Customer Session Required</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold text-center">
                  To register an onsite technical consultation or support dispatch ticket, please sign in as a Customer. Enter your name below to validate your profile instantly!
                </p>
              </div>

              <form onSubmit={handleInlineLogin} className="max-w-md mx-auto space-y-4 pt-2">
                {inlineLoginError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-800 font-medium rounded-lg">
                    {inlineLoginError}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={inlineLoginName}
                    onChange={(e) => setInlineLoginName(e.target.value)}
                    placeholder="Your Full Name (e.g. Samir Verma)"
                    className="flex-grow px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
                <div className="flex bg-blue-50/50 p-3 rounded-xl border border-blue-50 text-[10px] text-slate-500 font-mono items-start gap-1.5 text-left">
                  <span>💡 You can also log in using the Separated User/Admin section at the bottom of the Home screen anytime!</span>
                </div>
              </form>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-10.5 space-y-6">
              
              {/* Service categories explanation section */}
              <div className="p-4 bg-blue-50/30 rounded-md border border-blue-100 flex gap-4 text-xs text-slate-700 leading-relaxed items-center">
                <Sparkles className="w-8 h-8 text-[#1E40AF] flex-none" />
                <div className="font-semibold">
                  <strong className="block text-slate-900 font-bold uppercase tracking-wide text-[10px] mb-0.5">Corporate SLA Protection</strong>
                  Every Gurgaon onsite support visit gets automatically registered under our SLA tables, notifying technician desks for immediate prioritization.
                </div>
              </div>

              {pinValidationError && (
                <div className="p-4 rounded-md bg-red-50 text-red-800 text-xs font-semibold flex items-start gap-2.5 border border-red-150">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-none" />
                  <span>{pinValidationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Rajesh Khanna / Tajveer Singh"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Company Name (optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Aditya Law Firm, Cybercity"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Contact numbers */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Contact mobile number *</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g., 9911994766"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">WhatsApp notification number *</label>
                  <input
                    type="tel"
                    required
                    value={whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    placeholder="e.g., 9911994766"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Administrative Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., mailroom@yourbusiness.in"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Gurgaon address line strictly */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Physical Visit Address (Gurgaon strictly) *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Flat 405, Tower B, Uniworld Gardens, Sector 47"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Location verification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City (Fixed Gurgaon Haryana)</label>
                  <input
                    type="text"
                    disabled
                    value="Gurgaon"
                    className="w-full px-3 py-2.5 border border-slate-100 rounded-md text-sm bg-slate-100 font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State (Fixed Gurgaon Haryana)</label>
                  <input
                    type="text"
                    disabled
                    value="Haryana"
                    className="w-full px-3 py-2.5 border border-slate-100 rounded-md text-sm bg-slate-100 font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                {/* PIN Code operational check */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Gurugram PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g., 122002"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* GPS simulator */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">GPS Verification coordinates</label>
                  {gpsSimulated ? (
                    <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 p-2.5 border border-emerald-150 rounded-md text-xs font-mono font-bold">
                      <Compass className="w-4 h-4 text-emerald-600 flex-none animate-spin" />
                      <span>{latitude?.toFixed(5)}° N, {longitude?.toFixed(5)}° E</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={simulateGpsLocation}
                      className="w-full py-2 border border-dashed border-slate-200 hover:bg-slate-50 hover:border-[#1E40AF] text-slate-700 text-xs font-bold rounded-md flex items-center justify-center cursor-pointer uppercase tracking-wider"
                    >
                      <Compass className="w-4 h-4 mr-1.5 text-[#1E40AF]" />
                      Auto-detect GPS Location
                    </button>
                  )}
                </div>

                {/* Device type config */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Device Model / Support Type Needed *</label>
                  <input
                    type="text"
                    required
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    placeholder="e.g., LaserJet Pro MFP Printer / Lenovo ThinkCentre RAM Upgrade"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                </div>

                {/* Problem Description with Word Counter */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Problem Description (Limit 500 Words) *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={problemDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHAR_COUNT) {
                        setProblemDescription(e.target.value);
                      }
                    }}
                    placeholder="Provide explicit details about your IT situation. Include any error codes, crash records, or device configurations..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-450 font-semibold mt-1">
                    <span className="uppercase font-mono">Precision SLA diagnostics</span>
                    <span>{problemDescription.length} / {MAX_CHAR_COUNT} characters ({Math.max(0, 500 - problemDescription.split(/\s+/).filter(Boolean).length)} words left)</span>
                  </div>
                </div>

                {/* SLA priority selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Urgency/Priority Level *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-bold"
                  >
                    <option value="low">Standard Maintenance Visit (SLA 24 Hours)</option>
                    <option value="medium">Medium Priority Support (SLA 8 Hours)</option>
                    <option value="high">High System Conflict Visit (SLA 4 Hours)</option>
                    <option value="emergency">EMERGENCY OFFICE DOWN (SLA 2 Hours)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Visit Date *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Visit Time *</label>
                    <input
                      type="text"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="e.g., 11:30 AM"
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Submit button block */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wide flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-[#1E40AF] mr-1" />
                  Operated from Gurgaon, Sector 47 Haryana.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider rounded-md shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all cursor-pointer"
                >
                  {submitting ? 'Registering Booking...' : 'Register Onsite Support Request'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
