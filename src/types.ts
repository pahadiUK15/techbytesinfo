export type PriorityLevel = 'low' | 'medium' | 'high' | 'emergency';

export type RequestStatus = 
  | 'submitted' 
  | 'assigned' 
  | 'en_route' 
  | 'checked_in' 
  | 'completed' 
  | 'cancelled';

export interface DiagnosticResult {
  detectedIssue: string;
  explanation: string;
  steps: string[];
  recommendedCategory: string;
  recommendedProducts: string[];
  recommendedLicenses: string[];
}

export interface ServiceBooking {
  id: string;
  fullName: string;
  companyName?: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  address: string;
  city: string; // Gurgaon strictly
  state: string; // Haryana strictly
  pinCode: string;
  deviceType: string;
  assetTag?: string;
  problemDescription: string; // Limit 500 words
  priority: PriorityLevel;
  preferredDate: string;
  preferredTime: string;
  screenshotUrl?: string; // base64 or mock path
  status: RequestStatus;
  engineerName?: string;
  engineerPhone?: string;
  createdAt: string;
  trackingLink?: string;
  serviceReport?: {
    uploadedPhotos: string[];
    summary: string;
    signatureUrl?: string;
    completedAt: string;
  };
}

export interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'desktop' | 'workstation' | 'server' | 'printer' | 'networking' | 'component';
  type: 'new' | 'refurbished';
  brand: 'Dell' | 'HP' | 'Lenovo' | 'Acer' | 'ASUS' | 'Apple' | 'Microsoft' | 'Cisco' | 'Other';
  price: number;
  specs: string[];
  image: string;
  stock: number;
}

export interface License {
  id: string;
  name: string;
  category: 'Windows' | 'Microsoft 365' | 'Office' | 'Server' | 'Exchange' | 'Azure' | 'Security';
  priceMonthly: number;
  pricePerpetual?: number;
  features: string[];
  description: string;
}

export interface MockOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  itemType: 'product' | 'license';
  itemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'delivered';
  createdAt: string;
}

export interface Suggestion {
  id: string;
  authorName: string;
  email?: string;
  category: 'website' | 'service' | 'product_request' | 'other';
  content: string;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ITTicket {
  id: string; // e.g. INC-2026-001
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'cloud_access' | 'printer' | 'server';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'new' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  assetTag?: string;
  assignedEngineer?: string;
  comments: TicketComment[];
  slaExpiresAt: string; // ISOString representation
  resolutionCode?: string;
  resolutionNotes?: string;
  createdAt: string;
}


