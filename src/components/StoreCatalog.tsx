import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, HardDrive, ShieldAlert, Cpu, Sparkles,
  Search, CheckCircle2, ChevronRight, ShoppingCart, Tag, Filter,
  Edit, Trash2, Plus, X, Save, DollarSign, Image, ListPlus, LogIn, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, License } from '../types';

interface StoreCatalogProps {
  currentUser?: { username: string; role: 'user' | 'admin' } | null;
  onSetCurrentUser?: (user: { username: string; role: 'user' | 'admin' } | null) => void;
}

export default function StoreCatalog({ currentUser, onSetCurrentUser }: StoreCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [activeCatalog, setActiveCatalog] = useState<'hardware' | 'licensing'>('hardware');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Checkout modal states
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; price: number; type: 'product' | 'license' } | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Inline User login for checkouts
  const [inlineLoginName, setInlineLoginName] = useState('');
  const [inlineLoginError, setInlineLoginError] = useState('');

  // Admin Operational Modal States
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalMode, setAdminModalMode] = useState<'add' | 'edit'>('add');
  const [adminItemType, setAdminItemType] = useState<'hardware' | 'licensing'>('hardware');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Admin form fields - Products (Hardware)
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('laptop');
  const [prodType, setProdType] = useState<'new' | 'refurbished'>('new');
  const [prodBrand, setProdBrand] = useState('Dell');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSpecs, setProdSpecs] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState('10');

  // Admin form fields - Licenses (Software)
  const [licName, setLicName] = useState('');
  const [licCategory, setLicCategory] = useState('Windows');
  const [licPriceMonthly, setLicPriceMonthly] = useState('0');
  const [licPricePerpetual, setLicPricePerpetual] = useState('');
  const [licDescription, setLicDescription] = useState('');
  const [licFeatures, setLicFeatures] = useState('');

  const loadData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const licRes = await fetch('/api/licenses');
      if (prodRes.ok && licRes.ok) {
        setProducts(await prodRes.json());
        setLicenses(await licRes.json());
      }
    } catch (err) {
      console.error('Error fetching catalog data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync login details with form fields
  useEffect(() => {
    if (currentUser && currentUser.role === 'user') {
      setCustomerName(currentUser.username);
    }
  }, [currentUser]);

  const handleOpenCheckout = (item: Product | License, type: 'product' | 'license') => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      price: type === 'product' 
        ? (item as Product).price 
        : (item as License).priceMonthly > 0 
          ? (item as License).priceMonthly 
          : ((item as License).pricePerpetual || 0),
      type
    });
    setQuantity(1);
    setSuccessMsg(false);
    setInlineLoginError('');
    if (currentUser && currentUser.role === 'user') {
      setCustomerName(currentUser.username);
    } else {
      setCustomerName('');
    }
  };

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
    setCustomerName(capitalized);
    setInlineLoginError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail || !selectedItem) return;

    setSubmitting(true);
    const totalPrice = selectedItem.price * quantity;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          itemType: selectedItem.type,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          quantity,
          totalPrice
        })
      });

      if (res.ok) {
        setSuccessMsg(true);
        setCustomerPhone('');
        setCustomerEmail('');
      }
    } catch (error) {
      console.error('Failed submitting mock order', error);
    } finally {
      setSubmitting(false);
    }
  };

  // ADMIN OPERATIONS
  const handleOpenAdminAdd = (type: 'hardware' | 'licensing') => {
    setAdminModalMode('add');
    setAdminItemType(type);
    setEditingItemId(null);

    // Clear Hardware inputs
    setProdName('');
    setProdCategory('laptop');
    setProdType('new');
    setProdBrand('Dell');
    setProdPrice('50000');
    setProdSpecs('8GB RAM, 256GB SSD, Windows 11 Pro\nIntel Core i5, 14" IPS Display');
    setProdImage('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60');
    setProdStock('10');

    // Clear License inputs
    setLicName('');
    setLicCategory('Windows');
    setLicPriceMonthly('0');
    setLicPricePerpetual('12000');
    setLicDescription('Lifetime perpetual operating system key with enterprise protection safeguards.');
    setLicFeatures('Lifetime Updates\nInstant Key Delivery\nRetail Channel Activation\nMicrosoft Accounts Linkable');

    setAdminModalOpen(true);
  };

  const handleOpenAdminEdit = (item: any, type: 'product' | 'license') => {
    setAdminModalMode('edit');
    setEditingItemId(item.id);

    if (type === 'product') {
      setAdminItemType('hardware');
      setProdName(item.name);
      setProdCategory(item.category);
      setProdType(item.type);
      setProdBrand(item.brand);
      setProdPrice(item.price.toString());
      setProdSpecs(item.specs.join('\n'));
      setProdImage(item.image);
      setProdStock(item.stock.toString());
    } else {
      setAdminItemType('licensing');
      setLicName(item.name);
      setLicCategory(item.category);
      setLicPriceMonthly(item.priceMonthly.toString());
      setLicPricePerpetual(item.pricePerpetual ? item.pricePerpetual.toString() : '');
      setLicDescription(item.description);
      setLicFeatures(item.features.join('\n'));
    }

    setAdminModalOpen(true);
  };

  const handleSaveAdminForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (adminItemType === 'hardware') {
        const payload = {
          name: prodName,
          category: prodCategory,
          type: prodType,
          brand: prodBrand,
          price: Number(prodPrice),
          specs: prodSpecs.split('\n').map(s => s.trim()).filter(s => s.length > 0),
          image: prodImage || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
          stock: Number(prodStock)
        };

        const url = adminModalMode === 'add' ? '/api/products' : `/api/products/${editingItemId}`;
        const method = adminModalMode === 'add' ? 'POST' : 'PUT';

        const res = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-session': 'Pahadi@9310UK#$%'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setAdminModalOpen(false);
          loadData();
        }
      } else {
        const payload = {
          name: licName,
          category: licCategory,
          priceMonthly: Number(licPriceMonthly),
          pricePerpetual: licPricePerpetual ? Number(licPricePerpetual) : undefined,
          description: licDescription,
          features: licFeatures.split('\n').map(f => f.trim()).filter(f => f.length > 0)
        };

        const url = adminModalMode === 'add' ? '/api/licenses' : `/api/licenses/${editingItemId}`;
        const method = adminModalMode === 'add' ? 'POST' : 'PUT';

        const res = await fetch(url, {
          method,
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-session': 'Pahadi@9310UK#$%'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setAdminModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      console.error('Failed submitting admin changes', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string, type: 'product' | 'license') => {
    if (!window.confirm(`Are you absolutely sure you want to remove this catalog ${type}?`)) return;
    setLoading(true);

    try {
      const url = type === 'product' ? `/api/products/${id}` : `/api/licenses/${id}`;
      const res = await fetch(url, { 
        method: 'DELETE',
        headers: {
          'x-admin-session': 'Pahadi@9310UK#$%'
        }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed deleting catalog item', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter calculations
  const filteredProducts = products.filter(p => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchBrand = filterBrand === 'all' || p.brand === filterBrand;
    return matchCat && matchBrand;
  });

  return (
    <div className="py-12 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle & Filter header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8.5">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center md:text-left">
              Tech Bytes Partner Store
            </h2>
            <p className="text-slate-500 text-sm mt-1 text-center md:text-left">
              Secure authentic Microsoft Licenses and commercial grade Dell, HP, & Lenovo systems.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="inline-flex p-1 bg-white rounded-md border border-slate-200">
            <button
              id="btn-store-toggle-hardware"
              onClick={() => { setActiveCatalog('hardware'); setFilterCategory('all'); }}
              className={`px-4.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeCatalog === 'hardware' 
                  ? 'bg-[#1E40AF] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 inline mr-1.5" />
              Hardware Store
            </button>
            <button
              id="btn-store-toggle-licenses"
              onClick={() => { setActiveCatalog('licensing'); setFilterCategory('all'); }}
              className={`px-4.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeCatalog === 'licensing' 
                  ? 'bg-[#1E40AF] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 inline mr-1.5" />
              Licensing Store
            </button>
          </div>
        </div>

        {/* Dynamic Admin Add Control Banner */}
        {currentUser?.role === 'admin' && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => handleOpenAdminAdd(activeCatalog)}
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New {activeCatalog === 'hardware' ? 'Hardware Item' : 'Software License'}
            </button>
          </div>
        )}

        {activeCatalog === 'hardware' && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-white rounded-md border border-slate-200 shadow-xs">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-2">Category:</span>
            {['all', 'laptop', 'desktop', 'server', 'printer', 'networking', 'component'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs capitalize font-medium cursor-pointer ${
                  filterCategory === cat ? 'bg-[#1E40AF]/10 text-[#1E40AF] border border-[#1E40AF]/20 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'All Hardware' : cat}
              </button>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-4 hidden md:block" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-2">Brand:</span>
            {['all', 'Dell', 'HP', 'Lenovo', 'Cisco', 'Apple'].map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                  filterBrand === brand ? 'bg-[#1E40AF]/10 text-[#1E40AF] border border-[#1E40AF]/20 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {brand === 'all' ? 'All Brands' : brand}
              </button>
            ))}
          </div>
        )}

        {/* Catalog grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E40AF] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Syncing official corporate lists...</p>
          </div>
        ) : activeCatalog === 'hardware' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
                <div>
                  {/* Image and Badging */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.type === 'new' ? 'bg-[#1E40AF] text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {p.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                        {p.brand}
                      </span>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-5.5 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">{p.category}</span>
                      <h4 className="text-base font-bold text-slate-900 leading-tight tracking-tight line-clamp-2 h-10">{p.name}</h4>
                    </div>

                    {/* Specs checkbullet list */}
                    <ul className="space-y-1.5 border-t border-slate-50 pt-3 text-xs text-slate-500 h-28 overflow-y-auto font-semibold">
                      {p.specs.map((spec, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1E40AF] flex-none mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer price and actions */}
                <div className="p-5.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">Price</span>
                    <span className="text-lg font-extrabold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                  {currentUser?.role === 'admin' ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenAdminEdit(p, 'product')}
                        className="inline-flex items-center justify-center p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all cursor-pointer"
                        title="Edit Item Price or Photos"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(p.id, 'product')}
                        className="inline-flex items-center justify-center p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-buy-hardware-${p.id}`}
                      onClick={() => handleOpenCheckout(p, 'product')}
                      className="inline-flex items-center px-4 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer uppercase"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                      Place Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {licenses.map((lic) => (
              <div key={lic.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="p-6 space-y-5">
                   <div className="flex items-start justify-between">
                     <div>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E40AF] border border-blue-100">
                         {lic.category}
                       </span>
                       <h4 className="text-lg font-bold text-slate-900 tracking-tight mt-2">{lic.name}</h4>
                     </div>
                     <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-[#1E40AF] flex-none">
                       <ShoppingBag className="w-5 h-5" />
                     </div>
                   </div>

                  <p className="text-xs text-slate-500 leading-relaxed min-h-[3.5rem] font-semibold">
                    {lic.description}
                  </p>

                  <ul className="space-y-2 border-t border-slate-50 pt-4.5 text-xs text-slate-650 font-semibold">
                    {lic.features.map((feat, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#1E40AF] mt-0.5 flex-none" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">Licensing Fee</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {lic.priceMonthly > 0 ? `₹${lic.priceMonthly}/Mo` : `₹${(lic.pricePerpetual || 0).toLocaleString('en-IN')} Onetime`}
                    </span>
                  </div>
                  {currentUser?.role === 'admin' ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenAdminEdit(lic, 'license')}
                        className="inline-flex items-center justify-center p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all cursor-pointer"
                        title="Edit rates and parameters"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(lic.id, 'license')}
                        className="inline-flex items-center justify-center p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer"
                        title="Remove License"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-buy-license-${lic.id}`}
                      onClick={() => handleOpenCheckout(lic, 'license')}
                      className="inline-flex items-center px-4 py-2.5 rounded-md bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer uppercase"
                    >
                      Request License
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout / consultation modal */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden w-full max-w-lg"
              >
                
                {/* Checkout Header */}
                <div className="bg-[#1E40AF] px-6 py-5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wide uppercase text-blue-100">Order Booking / Consultation Form</span>
                    <h3 className="text-lg font-bold text-white">Secure Purchase Portal</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white font-semibold cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {!currentUser ? (
                  /* Inline User Login first before they can checkout */
                  <div className="p-6 space-y-5">
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-orange-600 mt-0.5 flex-none" />
                      <div>
                        <strong className="text-xs text-slate-800 font-bold block">User Login Required</strong>
                        <span className="text-[11px] text-slate-500 leading-relaxed block font-semibold">
                          To safely submit corporate quotes and order items, please log in as a User. Enter your name below to register your session instantly!
                        </span>
                      </div>
                    </div>

                    {inlineLoginError && (
                      <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-800 font-medium rounded-lg text-center">
                        {inlineLoginError}
                      </div>
                    )}

                    <form onSubmit={handleInlineLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Full Name*</label>
                        <input
                          type="text"
                          required
                          value={inlineLoginName}
                          onChange={(e) => setInlineLoginName(e.target.value)}
                          placeholder="e.g. Samir Verma"
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] font-semibold"
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs rounded-xl uppercase tracking-widest cursor-pointer"
                        >
                          Unlock Order Form & Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                ) : successMsg ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-150">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 block">Thank You! Order Registered Successfully.</span>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-semibold">
                      Our commercial licensing coordinator, <strong className="text-slate-800 font-bold">Tajveer Singh</strong>, has been notified immediately on <strong className="text-slate-800 font-bold">9911994766</strong>. We are preparing your official quotation or delivery details and will call you back shortly.
                    </p>
                    <div className="pt-4 grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/919911994766?text=Hi%20Tech%20Bytes,%20I%20just%20placed%20a%20request%20for%20quantity%20${quantity}%20of%20${encodeURIComponent(selectedItem.name)}.%20Please%20approve%20my%20quote.%20Name:%20${currentUser.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-750 text-white text-xs font-bold rounded-md transition-colors cursor-pointer uppercase text-center"
                      >
                        Notify on WhatsApp
                      </a>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="w-full px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-md cursor-pointer uppercase"
                      >
                        Close Dialog
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                    
                    {/* Item configuration summary block */}
                    <div className="p-4 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">ITEM DESCRIPTION</span>
                        <span className="text-sm font-bold text-slate-800 tracking-tight leading-tight block line-clamp-1">{selectedItem.name}</span>
                      </div>
                      <div className="text-right flex-none">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">UNIT PRICE</span>
                        <span className="text-sm font-extrabold text-[#1E40AF]">₹{selectedItem.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Customer Name*</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g., Aditya Law Firm / Kamal Singh"
                          className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Mobile number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Phone Number*</label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g., 9911994766"
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Business Email Address*</label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="e.g., corporate@firm.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] font-semibold"
                          />
                        </div>
                      </div>

                      {/* Quantity input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Required Quantity*</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            required
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-24 px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#1E40AF] text-center font-bold"
                          />
                          <span className="text-xs text-slate-500 font-semibold">Total Purchase Price: <strong className="text-slate-800 font-extrabold">₹{(selectedItem.price * quantity).toLocaleString('en-IN')}</strong></span>
                        </div>
                      </div>

                    </div>

                    {/* Actions panel */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(null)}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-md cursor-pointer uppercase"
                      >
                        Cancel Order
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition-colors flex items-center cursor-pointer uppercase"
                      >
                        {submitting ? 'Registering Order...' : 'Confirm Corporate Order'}
                      </button>
                    </div>

                  </form>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ADMIN OPERATION ADD / EDIT MODAL */}
        <AnimatePresence>
          {adminModalOpen && (
            <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden w-full max-w-2xl"
              >
                {/* Header */}
                <div className="bg-slate-950 px-6 py-5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-blue-400 font-bold block">
                      Admin Store Catalog Modifier
                    </span>
                    <h3 className="text-lg font-bold">
                      {adminModalMode === 'add' ? 'Add New Item' : 'Edit Catalog Parameter'} ({adminItemType === 'hardware' ? 'Hardware Product' : 'Software License'})
                    </h3>
                  </div>
                  <button
                    onClick={() => setAdminModalOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white text-xl cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSaveAdminForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs font-semibold">
                  {adminItemType === 'hardware' ? (
                    /* PRODUCT (HARDWARE) MOUNT */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Machine / Hardware Name*</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g., Lenovo ThinkPad P16 Gen 2"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Device Brand*</label>
                        <select
                          value={prodBrand}
                          onChange={(e) => setProdBrand(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        >
                          {['Dell', 'HP', 'Lenovo', 'Cisco', 'Apple', 'Other'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Device Type Bracket*</label>
                        <select
                          value={prodType}
                          onChange={(e) => setProdType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        >
                          <option value="new">New Sealed</option>
                          <option value="refurbished">Refurbished / Certified Preowned</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Store Category*</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        >
                          {['laptop', 'desktop', 'server', 'printer', 'networking', 'component'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Hardware Price (INR)*</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="e.g., 68000"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Current Inventory Stock*</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value)}
                          placeholder="e.g., 15"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Interactive Photograph URL* (Image change)</label>
                        <input
                          type="text"
                          required
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          placeholder="Image link / CDN url"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Detailed System Specifications (Separate lines)*</label>
                        <textarea
                          required
                          rows={4}
                          value={prodSpecs}
                          onChange={(e) => setProdSpecs(e.target.value)}
                          placeholder="e.g., Intel Xeon Processor Core W-2325&#10;128GB Enterprise DDR4 RAM&#10;Primary 2TB NVMe SSD Core Raid&#10;Windows Server Standard OS license installed"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                    </div>
                  ) : (
                    /* LICENSE (SOFTWARE) MOUNT */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">License Product / Suite Name*</label>
                        <input
                          type="text"
                          required
                          value={licName}
                          onChange={(e) => setLicName(e.target.value)}
                          placeholder="e.g., Microsoft 365 Business Standard Edition"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Software Category Suite*</label>
                        <select
                          value={licCategory}
                          onChange={(e) => setLicCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        >
                          {['Windows', 'Microsoft 365', 'Office', 'Server', 'Exchange', 'Azure', 'Security'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Monthly License Price (INR - 0 if Perpetual)*</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={licPriceMonthly}
                          onChange={(e) => setLicPriceMonthly(e.target.value)}
                          placeholder="e.g., 660"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">One-time / Perpetual Fee (INR - leave empty if subscription)</label>
                        <input
                          type="number"
                          min="0"
                          value={licPricePerpetual}
                          onChange={(e) => setLicPricePerpetual(e.target.value)}
                          placeholder="e.g., 14500"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Commercial Retail Description*</label>
                        <textarea
                          required
                          rows={3}
                          value={licDescription}
                          onChange={(e) => setLicDescription(e.target.value)}
                          placeholder="Commercial description of the license benefits, limits, and compatibility rules."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 uppercase tracking-wider mb-1.5">Featured Access Highlights (Separate lines)*</label>
                        <textarea
                          required
                          rows={4}
                          value={licFeatures}
                          onChange={(e) => setLicFeatures(e.target.value)}
                          placeholder="e.g., 1 TB OneDrive cloud storage per user&#10;Fully installed classic Office suite apps&#10;Secure active hybrid cloud synchronization&#10;Corporate calendar, business mailbox hosting"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                        />
                      </div>

                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="pt-4 border-t border-slate-150 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAdminModalOpen(false)}
                      className="px-4 py-2 bg-slate-150 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
                    >
                      <Save className="w-3.5 h-3.5 mr-1" />
                      {submitting ? 'Applying...' : 'Save Catalog Changes'}
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
