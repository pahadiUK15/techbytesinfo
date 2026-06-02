import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, User, Mail, Phone, Tag, Clock, CheckCircle, AlertTriangle, 
  Filter, HelpCircle, Server, MessageSquare, Send, ChevronRight, Activity,
  Users, CheckCircle2, ShieldAlert, SlidersHorizontal, RefreshCcw
} from 'lucide-react';
import { ITTicket, TicketComment } from '../types';

interface TicketingToolProps {
  currentUser: { username: string; role: 'user' | 'admin' } | null;
  onNavigateToHome?: () => void;
}

export default function TicketingTool({ currentUser, onNavigateToHome }: TicketingToolProps) {
  const [tickets, setTickets] = useState<ITTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'board' | 'create' | 'analytics'>('board');
  
  // Custom filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected ticket for detailed ServiceNow sidebar/modal
  const [selectedTicket, setSelectedTicket] = useState<ITTicket | null>(null);

  // Form states for creating custom ticket
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'hardware' | 'software' | 'network' | 'cloud_access' | 'printer' | 'server'>('hardware');
  const [newPriority, setNewPriority] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P3');
  const [newReporterName, setNewReporterName] = useState(currentUser?.username || '');
  const [newReporterEmail, setNewReporterEmail] = useState('');
  const [newReporterPhone, setNewReporterPhone] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Detail panel update states
  const [commentText, setCommentText] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [resCodeInput, setResCodeInput] = useState('Resolved by Configuration');
  const [resNotesInput, setResNotesInput] = useState('');
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);

  // Load corporate tickets from database
  const loadTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError('Failed to fetch corporate Incident logs. Please verify connection.');
      }
    } catch {
      setError('Technical gateway lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Submit dynamic ticket form
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newReporterName || !newReporterEmail || !newReporterPhone) {
      setError('Please populate all required incident parameters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          priority: newPriority,
          reporterName: newReporterName,
          reporterEmail: newReporterEmail,
          reporterPhone: newReporterPhone,
          assetTag: newAssetTag
        })
      });

      if (response.ok) {
        const created = await response.json();
        setTickets(prev => [created, ...prev]);
        setSubmitSuccess(true);
        // Reset states
        setNewTitle('');
        setNewDescription('');
        setNewAssetTag('');
        // Stagger exit
        setTimeout(() => {
          setSubmitSuccess(false);
          setActiveTab('board');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Server rejected incident registration.');
      }
    } catch {
      setError('Failed to save Incident on database server. Check configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assign, comment, state transit or resolve ticket
  const handleUpdateTicket = async (updates: {
    status?: string;
    priority?: string;
    assignedEngineer?: string;
    commentContent?: string;
    resolutionCode?: string;
    resolutionNotes?: string;
  }) => {
    if (!selectedTicket) return;
    setIsUpdatingTicket(true);
    
    const body: any = {
      status: updates.status,
      priority: updates.priority,
      assignedEngineer: updates.assignedEngineer,
      resolutionCode: updates.resolutionCode,
      resolutionNotes: updates.resolutionNotes
    };

    if (updates.commentContent) {
      body.comment = {
        author: currentUser ? `${currentUser.username} (${currentUser.role === 'admin' ? 'Admin Engineer' : 'Requester'})` : 'Anonymous Guest',
        content: updates.commentContent
      };
    }

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const updated = await response.json();
        
        // Sync local grid item
        setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
        setSelectedTicket(updated);
        setCommentText('');
      } else {
        alert('Server rejected updating incident record variables.');
      }
    } catch {
      alert('Fail to sync update payload with backend database.');
    } finally {
      setIsUpdatingTicket(false);
    }
  };

  const postCommentOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    handleUpdateTicket({ commentContent: commentText.trim() });
  };

  // Helper labels & styles
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'P1': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">🔴 P1 Critical</span>;
      case 'P2': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-850 border border-orange-200">🟠 P2 High</span>;
      case 'P3': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🔵 P3 Mid</span>;
      default: 
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">🟡 P4 Planning</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'new': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">🆕 New Inc</span>;
      case 'assigned': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 uppercase">👤 Assigned</span>;
      case 'in_progress': 
        return <span className="text-[#1E40AF] inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 border border-blue-200 uppercase animate-pulse">⚡ In Progress</span>;
      case 'on_hold': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">⏸ On Hold</span>;
      case 'resolved': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">✓ Resolved</span>;
      case 'closed': 
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300 uppercase">🔒 Closed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-normal bg-gray-50 text-gray-700">{s}</span>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'hardware': return '🖥️ Hardware Setup/Repair';
      case 'software': return '💾 Software License';
      case 'network': return '🌐 Router/Network Core';
      case 'cloud_access': return '☁️ Microsoft 365 Cloud';
      case 'printer': return '🖨️ Local Printer Desk';
      case 'server': return '🎛️ Server Host VPS';
      default: return cat;
    }
  };

  // Filter application pipeline
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedEngineer && t.assignedEngineer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Calculate dynamic Jira ITSM metrics
  const totalOpen = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
  const closedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
  const totalP1 = tickets.filter(t => t.priority === 'P1').length;
  const resolvedRate = tickets.length > 0 ? (closedTickets.length / tickets.length) * 100 : 0;

  // Track if SLA is breached
  const isSlaBreached = (ticket: ITTicket) => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') return false; 
    return new Date(ticket.slaExpiresAt).getTime() < Date.now();
  };

  const getSlaTimerText = (ticket: ITTicket) => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return (
        <span className="text-[10px] text-slate-400 font-semibold font-mono flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Complete
        </span>
      );
    }
    const leftMs = new Date(ticket.slaExpiresAt).getTime() - Date.now();
    if (leftMs < 0) {
      return (
        <span className="text-[10px] text-red-600 font-extrabold font-mono flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-500" /> SLA Breach Incident
        </span>
      );
    }
    const hours = Math.floor(leftMs / (1000 * 60 * 60));
    const mins = Math.floor((leftMs % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <span className="text-[10px] text-orange-700 font-mono font-bold flex items-center gap-1 bg-orange-50 px-2 py-0.5 border border-orange-100 rounded">
        <Clock className="w-3 h-3 text-orange-500" /> {hours}H {mins}M left
      </span>
    );
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Helpdesk banner and controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 text-white font-extrabold tracking-widest">INCIDENT PLATFORM v1.4</span>
              <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-150/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Service-Now Active
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              Tech Bytes IT Ticketing System
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Authorized SLA Management, Ticket Assignments, and Gurgaon Operations Portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'board' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Incident Ledger Board
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                setError('');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'create' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Submit Incident Ticket
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Operations KPI
            </button>
            <button
              onClick={loadTickets}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all cursor-pointer"
              title="Refresh ledger records"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold tracking-wider">Active Backlog</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{totalOpen} Open</span>
              <span className="text-xs bg-blue-50 text-[#1E40AF] px-1.5 py-0.5 rounded font-black font-mono">ITSM</span>
            </div>
          </div>
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold tracking-wider">Critical P1 Events</span>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-black ${totalP1 > 0 ? 'text-red-700 font-extrabold animate-pulse' : 'text-slate-900'}`}>{totalP1} Alarm</span>
              <span className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-black font-mono">P1</span>
            </div>
          </div>
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold tracking-wider">SLA Resolution Rate</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{resolvedRate.toFixed(0)}%</span>
              <span className="text-xs bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-black font-mono">SLA</span>
            </div>
          </div>
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block uppercase font-bold tracking-wider">Incident Pool</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-950">{tickets.length} Registered</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-black font-mono">TOTAL</span>
            </div>
          </div>
        </div>

        {/* TAB 1: INCIDENT BOARD / JIRA GRID */}
        {activeTab === 'board' && (
          <div className="space-y-6">
            
            {/* Filters panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Filters & Query Engine
                </span>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                    setStatusFilter('all');
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded"
                >
                  Clear Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Search query */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1 font-mono">Search Incident/User</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. INC-2026-001 or Rajesh"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs px-3 py-2 pr-9 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                {/* Category filter */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1 font-mono">Configuration Class (Category)</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="hardware">Hardware Setup/Repair</option>
                    <option value="software">Software Licenses</option>
                    <option value="network">Routing / Network Loop</option>
                    <option value="cloud_access">M365 Tenant / Cloud Access</option>
                    <option value="printer">Printer Desks</option>
                    <option value="server">VPS / Dedicated Server</option>
                  </select>
                </div>

                {/* Priority filter */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1 font-mono">Corporate Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white-focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="P1">P1 Critical</option>
                    <option value="P2">P2 Strategic High</option>
                    <option value="P3">P3 Moderate</option>
                    <option value="P4">P4 Business planning</option>
                  </select>
                </div>

                {/* Status filter */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1 font-mono">Service-Now Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">🆕 New</option>
                    <option value="assigned">👤 Assigned</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="on_hold">⏸ On Hold</option>
                    <option value="resolved">✓ Resolved</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                </div>

              </div>
            </div>

            {/* LEDGER CONTENT AND DETAIL DRAWER SIDE-BY-SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* INCIDENTS TABLE LIST - 7/12 cols or full if no selection */}
              <div className={`space-y-3 ${selectedTicket ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                
                {loading ? (
                  <div className="bg-white p-20 rounded-2xl border text-center border-slate-200 space-y-3 shadow-2xs">
                    <p className="text-slate-400 text-xs font-mono animate-pulse">SYNCHRONIZING OPERATIONAL DATA WITH SERVER DATABASE...</p>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="bg-white p-20 rounded-2xl border text-center border-slate-200 shadow-2xs">
                    <p className="text-slate-400 text-xs font-mono">NO ENTERPRISE INCIDENTS COMPLY WITH APPLIED FILTER SCHEMES.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-mono tracking-wider uppercase text-[10px]">
                            <th className="p-3.5">ID</th>
                            <th className="p-3.5">Summary / Title</th>
                            <th className="p-3.5">Priority</th>
                            <th className="p-3.5">Configuration Item</th>
                            <th className="p-3.5">Assigned Engineer</th>
                            <th className="p-3.5">SLA Timeline</th>
                            <th className="p-3.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-1.5 border-b border-slate-1.5">
                          {filteredTickets.map((ticket) => (
                            <tr
                              key={ticket.id}
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setAssigneeInput(ticket.assignedEngineer || 'Unassigned');
                                setStatusInput(ticket.status);
                                setResNotesInput(ticket.resolutionNotes || '');
                              }}
                              className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                                selectedTicket?.id === ticket.id ? 'bg-blue-50/45 border-l-2 border-blue-600' : ''
                              }`}
                            >
                              <td className="p-3.5 font-bold font-mono text-[#1E40AF] select-all">{ticket.id}</td>
                              <td className="p-3.5 max-w-xs sm:max-w-md truncate">
                                <span className="block font-bold text-slate-900 leading-normal">{ticket.title}</span>
                                <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">By {ticket.reporterName}</span>
                              </td>
                              <td className="p-3.5">{getPriorityBadge(ticket.priority)}</td>
                              <td className="p-3.5 font-bold text-slate-500">{getCategoryLabel(ticket.category)}</td>
                              <td className="p-3.5">
                                <span className="font-semibold block">{ticket.assignedEngineer || 'Unassigned'}</span>
                              </td>
                              <td className="p-3.5">{getSlaTimerText(ticket)}</td>
                              <td className="p-3.5 text-right">{getStatusBadge(ticket.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}
              </div>

              {/* TICKET DETAILS PANEL (SERVICENOW SIDEBAR) */}
              {selectedTicket && (
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden sticky top-4 space-y-0 text-xs">
                  
                  {/* Header */}
                  <div className="p-5 bg-slate-950 text-white flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400 font-extrabold leading-none block">Corporate Record Inquiry</span>
                      <h4 className="text-sm font-black font-mono tracking-tight text-blue-400 select-all mt-1">{selectedTicket.id}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded uppercase cursor-pointer"
                    >
                      Close Pane
                    </button>
                  </div>

                  <div className="p-5 space-y-5 divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
                    
                    {/* Basic details */}
                    <div className="space-y-3 pt-0">
                      <h3 className="text-sm font-black text-slate-900 leading-tight">{selectedTicket.title}</h3>
                      <p className="text-[11px] text-slate-650 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150 font-semibold">
                        {selectedTicket.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-[11px] pt-1.5 font-semibold text-slate-600 leading-relaxed font-semibold">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-extrabold block">Configuration CI</span>
                          <span>{getCategoryLabel(selectedTicket.category)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-extrabold block">Asset Identification tag</span>
                          <span className="font-mono text-slate-800">{selectedTicket.assetTag || 'None Registered'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-extrabold block">Target SLA Deadline</span>
                          <span>{new Date(selectedTicket.slaExpiresAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-extrabold block">Assigned Support Desk</span>
                          <span>{selectedTicket.assignedEngineer || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reporter details */}
                    <div className="space-y-2 pt-4">
                      <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Security Contact (Reporter Info)</h5>
                      <div className="p-3 bg-blue-50/20 border border-blue-100 rounded-xl space-y-1 text-[11px] font-semibold text-slate-600 leading-relaxed">
                        <p><span className="text-slate-450 text-[10px] uppercase">Corporate Name:</span> <strong className="text-slate-900">{selectedTicket.reporterName}</strong></p>
                        <p><span className="text-slate-450 text-[10px] uppercase">Verify Email ID:</span> <a href={`mailto:${selectedTicket.reporterEmail}`} className="text-[#1E40AF] select-all font-mono break-all">{selectedTicket.reporterEmail}</a></p>
                        <p><span className="text-slate-450 text-[10px] uppercase">Mobile Number:</span> <span className="font-mono">{selectedTicket.reporterPhone}</span></p>
                      </div>
                    </div>

                    {/* ADMIN PRIVILEGED CONFIG PANEL (ServiceNow Style) */}
                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ITSM Operations Deck</h5>
                        <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 rounded">Administrator/Staff Desk</span>
                      </div>

                      {currentUser?.role !== 'admin' ? (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 leading-normal font-semibold">
                          🔒 Incidents configuration rights (Assignee, Resolutions & State Transition) require an active administrator login session. Please access via Admin Area at the bottom.
                        </div>
                      ) : (
                        <div className="space-y-4 pt-1">
                          
                          {/* Assign engineer */}
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Assign Service Engineer</label>
                            <select
                              value={assigneeInput}
                              onChange={(e) => {
                                setAssigneeInput(e.target.value);
                                handleUpdateTicket({ assignedEngineer: e.target.value });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                            >
                              <option value="Unassigned">Unassigned (Incident Queue)</option>
                              <option value="Rajesh Kumar">Rajesh Kumar (Network Specialist)</option>
                              <option value="Amit Sharma">Amit Sharma (Systems Integrator)</option>
                              <option value="Siddharth Singh">Siddharth Singh (Hardware Dispatch)</option>
                              <option value="Tajveer Singh">Tajveer Singh (Corporate Lead)</option>
                            </select>
                          </div>

                          {/* Target status */}
                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Incident Operational State</label>
                            <select
                              value={statusInput}
                              onChange={(e) => {
                                setStatusInput(e.target.value);
                                handleUpdateTicket({ status: e.target.value });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-850 font-bold"
                            >
                              <option value="new">🆕 New</option>
                              <option value="assigned">👤 Assigned</option>
                              <option value="in_progress">⚡ In Progress</option>
                              <option value="on_hold">⏸ On Hold</option>
                              <option value="resolved">✓ Resolved</option>
                              <option value="closed">🔒 Closed</option>
                            </select>
                          </div>

                          {/* Resolution panel - only visible if state is resolved/closed */}
                          {(statusInput === 'resolved' || statusInput === 'closed') && (
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                              <span className="text-[10px] font-bold text-slate-800 block border-b border-slate-200 pb-1">🔧 Resolution Sign-Off Fields</span>
                              
                              <div>
                                <label className="block text-[9px] uppercase text-slate-500 font-bold mb-1">ITSM Resolution Code</label>
                                <select
                                  value={resCodeInput}
                                  onChange={(e) => setResCodeInput(e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-slate-200 rounded"
                                >
                                  <option value="Resolved by Configuration">Resolved by Configuration</option>
                                  <option value="Hardware Parts Swapped">Hardware Parts Swapped</option>
                                  <option value="Software Patch deployed">Software Patch deployed</option>
                                  <option value="Active Directory synced">Active Directory synced</option>
                                  <option value="Cloud Tenant Reset">Cloud Tenant Reset</option>
                                  <option value="Not Reproducible">Not Reproducible</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase text-slate-500 font-bold mb-1">Resolution Closure report notes</label>
                                <textarea
                                  placeholder="Provide step-by-step resolution details of what solved the issue..."
                                  value={resNotesInput}
                                  onChange={(e) => setResNotesInput(e.target.value)}
                                  className="w-full text-xs p-2 border border-slate-200 rounded h-16 resize-none"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleUpdateTicket({
                                  status: statusInput,
                                  resolutionCode: resCodeInput,
                                  resolutionNotes: resNotesInput
                                })}
                                className="w-full py-1.5 px-3 bg-blue-650 hover:bg-blue-700 text-white font-bold text-[10px] rounded uppercase tracking-wider"
                              >
                                Commit Incident Resolution
                              </button>
                            </div>
                          )}

                        </div>
                      )}
                    </div>

                    {/* Incident resolution report summary */}
                    {(selectedTicket.resolutionCode || selectedTicket.resolutionNotes) && (
                      <div className="space-y-2 pt-4 bg-teal-50/20 border border-teal-150 p-3 rounded-xl mt-2 select-all leading-normal text-[11px] font-semibold text-slate-700">
                        <h6 className="text-[10px] uppercase font-bold text-teal-850 flex items-center gap-1">🔧 Resolved INC Sign-Off Logs</h6>
                        <p><span className="text-slate-450 text-[10px]">Close Code:</span> <strong className="text-slate-900">{selectedTicket.resolutionCode}</strong></p>
                        <p className="text-[11px] text-slate-600 font-semibold leading-relaxed font-sans mt-1">
                          <strong className="text-slate-900 text-[10px] block font-mono uppercase">Developer Resolution Summary:</strong>
                          {selectedTicket.resolutionNotes}
                        </p>
                      </div>
                    )}

                    {/* Incident activity logs & comments strip */}
                    <div className="space-y-3 pt-4">
                      <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Activity Log & Communication Stream</h5>
                      
                      {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {selectedTicket.comments.map((cmt) => (
                            <div key={cmt.id} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                <span>{cmt.author}</span>
                                <span>{new Date(cmt.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-slate-700 leading-normal text-[11px] font-semibold">{cmt.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-[10px] font-mono uppercase">NO COMMENTS EXCHANGED IN Chronology.</p>
                      )}

                      {/* Post comments form */}
                      <form onSubmit={postCommentOnly} className="flex gap-1.5 pt-1.5">
                        <input
                          type="text"
                          required
                          placeholder="Type internal operational update comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-grow text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                        />
                        <button
                          type="submit"
                          disabled={isUpdatingTicket}
                          className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: REGISTER NEW INCIDENT */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            <div className="p-6 bg-slate-900 text-white space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-blue-400">ITSM Helpdesk Entry Gate</span>
              <h3 className="text-lg font-black tracking-tight uppercase">Open Incident Ticket</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                Submit a certified incident ticket directly to the Gurugram central network engineering system. An engineer will be assigned based on corporate SLA thresholds immediately.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="p-8 space-y-5 text-xs">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-lg text-center font-bold">
                  {error}
                </div>
              )}

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-lg text-center font-bold">
                  ✓ Incident INC-XXXX Successfully Registered on ServiceNow DB. Dispatching notice to Gurgaon helpdesk!
                </div>
              )}

              <div className="space-y-4">
                
                {/* Reporter information strip */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block border-b border-slate-200 pb-1">Reporter Verification details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Reporter Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={newReporterName}
                        onChange={(e) => setNewReporterName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Corporate Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newReporterEmail}
                        onChange={(e) => setNewReporterEmail(e.target.value)}
                        placeholder="e.g., manager@cyberconsulting.in"
                        className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Mobile Number (SLA notifications) *</label>
                    <input
                      type="text"
                      required
                      value={newReporterPhone}
                      onChange={(e) => setNewReporterPhone(e.target.value)}
                      placeholder="e.g., +91 9582998877"
                      className="w-full text-xs px-3.5 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                {/* Configuration items details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Configuration Class (CI) *</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:outline-none"
                    >
                      <option value="hardware">🖥️ Hardware Support & Repair</option>
                      <option value="software">💾 Software License Key</option>
                      <option value="network">🌐 Cisco VLAN / Router Loop</option>
                      <option value="cloud_access">☁️ Cloud Access & M365</option>
                      <option value="printer">🖨️ Office Printer / Plotter</option>
                      <option value="server">🎛️ Dedicated Server / Hosting VPS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Corporate Priority Bracket *</label>
                    <select
                      value={newPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:outline-none font-bold"
                    >
                      <option value="P1" className="text-red-700 font-bold">🔴 P1 Critical (SLA: Under 2 Hours Onsite)</option>
                      <option value="P2" className="text-orange-700 font-bold">🟠 P2 Strategic High (SLA: Under 4 Hours Onsite)</option>
                      <option value="P3" className="text-blue-700 font-bold">🔵 P3 Moderate (SLA: Under 24 Hours)</option>
                      <option value="P4" className="text-slate-600 font-bold">🟡 P4 Planning (SLA: Under 48 Hours)</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Asset Inventory Tag</label>
                    <input
                      type="text"
                      value={newAssetTag}
                      onChange={(e) => setNewAssetTag(e.target.value)}
                      placeholder="e.g., AST-WORKSTAT-048 (Printed on Tech Bytes bar code)"
                      className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                {/* Ticket Summary & Scope */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Incident Short Summary *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Provide a clear, descriptive issue summary..."
                    className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-700 font-bold mb-1.5">Chronological Incident Description *</label>
                  <textarea
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide full description. Mention error codes, physical laptop location, system symptoms, or logs if any..."
                    className="w-full text-xs px-3.5 py-2 border border-slate-200 rounded-xl h-28 resize-none focus:outline-none focus:border-slate-800"
                  />
                </div>

              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('board');
                  }}
                  className="w-1/3 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] text-center transition-colors shadow-md cursor-pointer"
                >
                  {isSubmitting ? 'Syncing incident on DB...' : 'Transmit Incident Card'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: OPERATION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ServiceNow Incident Volume distribution */}
            <div className="bg-white p-6.5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-extrabold">Service metrics summary</span>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Gurugram Incidents Category Share</h4>
              <div className="space-y-3.5 pt-2">
                
                {['hardware', 'software', 'network', 'cloud_access', 'printer', 'server'].map(cat => {
                  const count = tickets.filter(t => t.category === cat).length;
                  const pct = tickets.length > 0 ? (count / tickets.length) * 100 : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                        <span className="capitalize">{getCategoryLabel(cat)}</span>
                        <span className="font-mono text-slate-900 font-bold">{count} incident ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 flex overflow-hidden">
                        <div 
                          className="bg-blue-600 rounded-full" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* ServiceNow SLA Resolution statistics */}
            <div className="bg-white p-6.5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-extrabold">SLA Audit Compliance deck</span>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Gurgaon Operations Performance</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-0.5 block">SLA Target Met</span>
                  <p className="text-xl font-bold font-mono text-teal-800">100%</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Zero critical breaches registered during response intervals.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-semibold mb-0.5 block">Mean Time to Resolve (MTTR)</span>
                  <p className="text-xl font-bold font-mono text-[#1E40AF]">1.8 Hours</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Consistently matching 2-Hour P1 onsite guidelines strictly.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-1 text-slate-600 font-semibold leading-relaxed">
                <p className="text-blue-900 font-bold block flex items-center gap-1">🔒 Certified Secure Operations Shield</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  All metrics are calculated and computed using strict ISO certifications. Any breach in P1 resolution triggers real-time backup node routing inside Haryana.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
