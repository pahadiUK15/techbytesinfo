import { useState } from 'react';
import { 
  Laptop, Server, Cloud, Cpu, Activity, RefreshCw, 
  HelpCircle, CheckCircle, ChevronRight, Phone, MessageSquare, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesListProps {
  onSelectBookingCategory: (category: string) => void;
}

export default function ServicesList({ onSelectBookingCategory }: ServicesListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('hardware');

  const categories = [
    { id: 'hardware', label: 'Onsite & Hardware Support', icon: Laptop },
    { id: 'microsoft', label: 'Microsoft & Cloud', icon: Cloud },
    { id: 'networking', label: 'Network & Servers', icon: Server },
    { id: 'linux', label: 'Linux Engineering', icon: Cpu },
    { id: 'ai-dev', label: 'AI & Automations', icon: Activity },
    { id: 'recovery', label: 'Data Recovery Labs', icon: RefreshCw },
  ];

  const serviceDetails: Record<string, {
    title: string;
    tagline: string;
    highlights: string[];
    description: string;
    platforms: string[];
  }> = {
    hardware: {
      title: 'Enterprise Onsite & Helpdesk Support',
      tagline: 'Reliable troubleshooting at your office or home workspace in Gurgaon.',
      highlights: [
        'Laptop and Desktop Repair (Dell, HP, Lenovo, Apple, Asus)',
        'MacBook / Apple Device Hardware Diagnostics & Systems Setup',
        'Laser & Inkjet Office Network Printer Installation & Troubleshooting',
        'Annual Maintenance Contracts (AMC) with Quarterly Preventive Audits',
        'Corporate Office Workspace IT Setup, cabling & routing installations',
        'Windows / Apple OS installations, patch updates & data backups'
      ],
      description: 'Our helpdesk dispatched field engineers resolve PC sluggishness, printer queues, motherboard repairs, SSD speed upgrades, and setup new employee laptops onsite in Gurgaon in record response times.',
      platforms: ['Dell Workstations', 'HP ProBook', 'ThinkPad', 'Apple MacBooks', 'ASUS ZenBook', 'Canon / LaserJet']
    },
    microsoft: {
      title: 'Microsoft 365 Cloud & Operating Systems Support',
      tagline: 'Certified design, deployment, & migration of Microsoft ecosystem suites.',
      highlights: [
        'Secure deployment of Windows 10, Windows 11 Enterprise nodes',
        'Microsoft 365 Licensing provision & Outlook desktop credentials configure',
        'Exchange Online mailbox configurations & SharePoint library architectures',
        'Intune MDM & SCCM / MECM enterprise software distribution tables',
        'Azure Cloud active directory tenant design, identity & AZ-104 solutions',
        'Expert guidance regarding Microsoft certification suites: MD-102, MS-102'
      ],
      description: 'Setup resilient collaborative setups. We configure complete hybrid-office cloud solutions with strict security baselines, spam filters, OneDrive storage allocations, and secure Teams workspaces.',
      platforms: ['Windows Server 2025', 'Microsoft 365', 'OneDrive', 'Entra ID', 'SharePoint Online', 'Teams Suite']
    },
    networking: {
      title: 'Cisco Routing, Switching & Server Infrastructure',
      tagline: 'Enterprise-grade connectivity designs aligned to CCNA/CCNP requirements.',
      highlights: [
        'Corporate firewall installation, ACL setup & security rules deployment',
        'Cisco, HP, & Aruba managed switches and VLAN configuration matrix',
        'Site-to-Site VPN & Remote-user SSL VPN setups for remote files access',
        'Virtualization hosts management via VMware ESXi, vCenter, & Hyper-V',
        'Windows Server Active Directory domain configuration & GPO deployments',
        'Enterprise Wireless layouts (WLAN) with custom secure guest portal splash'
      ],
      description: 'We eliminate signal dropouts and secure internal folders. Our experts construct high-availability server racks, NAS storage solutions, and robust VLAN isolation to shield sensitive company financial records.',
      platforms: ['Cisco Routers', 'VLAN Splitting', 'IPsec Secure VPN', 'ESXi Virtualization', 'Hyper-V', 'MECM Deploy']
    },
    linux: {
      title: 'Linux Systems Administration & System Engineering',
      tagline: 'RHCSA / RHCE expert administrators at your service.',
      highlights: [
        'Operating Systems deployment for Ubuntu Server, CentOS, and Rocky Linux',
        'Apache & Nginx web servers installation, configuration & SSL loading',
        'Internal directory and network share setups with Samba Services',
        'Local office DNS & DHCP infrastructure deployment and optimization',
        'Database hosting systems administration (PostgreSQL, MySQL, Redis)',
        'Automated Shell or Python crontab scripts for data server backups'
      ],
      description: 'We maintain your hosting and intranet nodes. Get expert Linux engineering to deploy high-concurrency microservices, configure firewalld guidelines, and secure private Samba cloud storage.',
      platforms: ['Ubuntu Server', 'CentOS / Rocky Linux', 'Apache HTTPD', 'Nginx Proxy', 'Samba File Shares', 'ISC BIND DNS']
    },
    'ai-dev': {
      title: 'Custom AI Agent Development & SaaS Automations',
      tagline: 'Modernize workflows and automate communications with state of the art AI.',
      highlights: [
        'Custom WhatsApp AI Agents for automated order tracking and ticket creations',
        'Email Monitoring AI Agents for auto ticket classification & response writing',
        'Gemini-powered Customer Support chatbots for instant customer success',
        'Automated workflow pipelines building through n8n & Zapier platforms',
        'SaaS business process automation applets powered by LLMs'
      ],
      description: 'Bring AI into your daily business operations. We build smart automation bots that monitor inbound business inquiries, classify requests, and record critical logs to save hundreds of operational hours.',
      platforms: ['@google/genai', 'WhatsApp Business API', 'n8n pipelines', 'Gmail Graph API', 'Ollama Systems']
    },
    recovery: {
      title: 'Certified Data Recovery Services',
      tagline: 'Advanced forensic recovery from corrupted, formatted, or failed drives.',
      highlights: [
        'HDD Data Recovery from physically clicky or water-logged internal disks',
        'SSD Data Recovery dealing with unmountable NAND controller failures',
        'RAID Assembly recovery (RAID 0, 1, 5, 10 array crash restorations)',
        'USB Portable Pen Drives & Memory Cards formatted data retreival',
        'Server database block file repair & local NAS volume disaster recovery',
        'Strict NDA-level data confidentiality guarantees for customer safety'
      ],
      description: 'Never lose critical files. Our diagnostic recovery labs leverage hardware imaging tools to rebuild corrupt files blocks, retrieve databases from unbootable environments, and hand back your valuable enterprise profiles.',
      platforms: ['Mechanical HDD', 'NVMe / SATA SSD', 'RAID 5 Arrays', 'USB Thumb drives', 'NAS Server Volumes']
    }
  };

  const activeData = serviceDetails[activeCategory] || serviceDetails.hardware;

  return (
    <div className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            Our Certified IT Solutions Portfolio
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Every service is handled by skilled regional technicians and certified network systems engineers.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:-mx-0 sm:px-0 gap-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-service-tab-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#1E40AF] text-white shadow-lg shadow-blue-500/10 border-transparent' 
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 flex-none" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel Segment */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch p-8 sm:p-10 rounded-xl border border-slate-200 bg-white"
        >
          
          {/* Detailed Description Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] border border-blue-100">
                Tech Bytes Solutions
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {activeData.title}
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                {activeData.tagline}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {activeData.description}
              </p>

              {/* Checkbox itemization of capabilities */}
              <div className="space-y-2.5 pt-2">
                {activeData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#1E40AF] mt-0.5 flex-none" />
                    <span className="text-sm text-slate-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Badging list */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-widest mb-2">Supported Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {activeData.platforms.map((platform, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-50 text-[11px] font-mono text-slate-600 border border-slate-200">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Prompt Booking Callout Box */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F8FAFC] p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-150">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Need Urgent Technical Assistance?</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Most general hardware, network setups, or system crashes can be booked directly for home/office onsite visits in Gurgaon. For specialized cloud/licensing work, you can directly dial our engineers or send a WhatsApp.
              </p>
            </div>

            <div className="space-y-3 mt-6 sm:mt-0 relative z-10">
              <button
                id="btn-service-book-now"
                onClick={() => onSelectBookingCategory(activeData.title)}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-bold rounded-md transition-all cursor-pointer uppercase shadow-lg shadow-blue-900/10"
              >
                Book Onsite Service Call
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:9911994766"
                  className="inline-flex items-center justify-center px-3 py-2.5 border border-slate-200 text-xs font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#1E40AF]" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/919911994766?text=Hi%20Tech%20Bytes,%20I'd%20like%20to%20query%20about%20${encodeURIComponent(activeData.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2.5 border border-slate-200 text-xs font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Backlog Accent */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-[0.03] -z-0">
              <Server className="w-48 h-48" />
            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}
