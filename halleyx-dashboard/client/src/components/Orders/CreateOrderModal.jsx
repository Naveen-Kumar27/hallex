import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal';

const COUNTRIES = ["United States", "Canada", "Australia", "Singapore", "Hong Kong"];
const PRODUCTS = [
  "VoIP Corporate Package",
  "Business Internet 500 Mbps",
  "Fiber Internet 1 Gbps",
  "5G Unlimited Mobile Plan",
  "Fiber Internet 300 Mbps"
];
const STATUSES = ["Pending", "In Progress", "Completed"];
const CREATORS = ["Mr. Michael Harris", "Mr. Ryan Cooper", "Ms. Olivia Carter", "Mr. Lucas Martin"];

const CreateOrderModal = ({ isOpen, onClose, onSave, editingOrder }) => {
  const [formData, setFormData] = useState({
     customer: {
        firstName: '', lastName: '', email: '', phoneNumber: '',
        streetAddress: '', city: '', stateProvince: '', postalCode: '',
        country: 'Canada'
     },
     orderInfo: {
        product: 'Fiber Internet 300 Mbps',
        quantity: 1,
        unitPrice: 100,
        status: 'Pending',
        createdBy: 'Mr. Michael Harris',
        orderDate: new Date()
     }
  });
  const [totalAmount, setTotalAmount] = useState(100);

  useEffect(() => {
     if (editingOrder) {
        setFormData(editingOrder);
     } else {
        setFormData({
            customer: {
               firstName: '', lastName: '', email: '', phoneNumber: '',
               streetAddress: '', city: '', stateProvince: '', postalCode: '',
               country: 'Canada'
            },
            orderInfo: {
               product: 'Fiber Internet 300 Mbps',
               quantity: 1,
               unitPrice: 100,
               status: 'Pending',
               createdBy: 'Mr. Michael Harris',
               orderDate: new Date()
            }
        });
     }
  }, [editingOrder, isOpen]);

  useEffect(() => {
     const t = (formData.orderInfo.quantity || 0) * (formData.orderInfo.unitPrice || 0);
     setTotalAmount(t);
  }, [formData.orderInfo.quantity, formData.orderInfo.unitPrice]);

  const handleChange = (section, field, value) => {
      setFormData(prev => ({
          ...prev,
          [section]: {
              ...prev[section],
              [field]: value
          }
      }));
  };

   const handleSubmit = (e) => {
       e.preventDefault();
       const t = formData.orderInfo.quantity * formData.orderInfo.unitPrice;
       const finalData = { 
           ...formData, 
           orderInfo: {
               ...formData.orderInfo,
               totalAmount: t
           }
       };
       onSave(finalData);
   };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingOrder ? "Synchronize Order Data" : "Initialize New Order"} maxWidth="2xl">
       <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-4 scrollbar-hide">
          
          <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-borderLight pb-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h4 className="text-textPrimary font-bold uppercase tracking-widest text-xs">Customer Ecosystem</h4>
              </div>
              <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">First name</label>
                      <input required type="text" value={formData.customer.firstName} onChange={(e) => handleChange('customer', 'firstName', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" placeholder="John" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Last name</label>
                      <input required type="text" value={formData.customer.lastName} onChange={(e) => handleChange('customer', 'lastName', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" placeholder="Doe" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Email Protocol</label>
                      <input required type="email" value={formData.customer.email} onChange={(e) => handleChange('customer', 'email', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Phone Link</label>
                      <input required type="text" value={formData.customer.phoneNumber} onChange={(e) => handleChange('customer', 'phoneNumber', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" placeholder="+1 234 567 890" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Mailing Anchor</label>
                      <input required type="text" value={formData.customer.streetAddress} onChange={(e) => handleChange('customer', 'streetAddress', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" placeholder="123 Silicon Valley Way" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">City Hub</label>
                      <input required type="text" value={formData.customer.city} onChange={(e) => handleChange('customer', 'city', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Province/State</label>
                      <input required type="text" value={formData.customer.stateProvince} onChange={(e) => handleChange('customer', 'stateProvince', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Postcode</label>
                      <input required type="text" value={formData.customer.postalCode} onChange={(e) => handleChange('customer', 'postalCode', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Geographic Region</label>
                      <select required value={formData.customer.country} onChange={(e) => handleChange('customer', 'country', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-borderLight pb-3">
                  <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                  <h4 className="text-textPrimary font-bold uppercase tracking-widest text-xs">Product parameters</h4>
              </div>
              <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Deployment Module</label>
                      <select required value={formData.orderInfo.product} onChange={(e) => handleChange('orderInfo', 'product', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                          {PRODUCTS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Quantity</label>
                      <input required type="number" min="1" value={formData.orderInfo.quantity} onChange={(e) => handleChange('orderInfo', 'quantity', parseInt(e.target.value, 10))} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Unit Value</label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary text-xs font-bold">$</span>
                          <input required type="number" min="0" step="0.01" value={formData.orderInfo.unitPrice} onChange={(e) => handleChange('orderInfo', 'unitPrice', parseFloat(e.target.value))} className="w-full bg-surface border border-borderLight rounded-2xl pl-8 pr-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all" />
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Aggregated Total</label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xs font-bold">$</span>
                          <input type="text" readOnly value={totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} className="w-full bg-surface border border-borderLight rounded-2xl pl-8 pr-4 py-3 text-sm text-primary font-bold outline-none cursor-not-allowed shadow-inner" />
                      </div>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Status Phase</label>
                      <select required value={formData.orderInfo.status} onChange={(e) => handleChange('orderInfo', 'status', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                          {STATUSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-textTertiary uppercase tracking-widest ml-1">Operational Creator</label>
                      <select required value={formData.orderInfo.createdBy} onChange={(e) => handleChange('orderInfo', 'createdBy', e.target.value)} className="w-full bg-surface border border-borderLight rounded-2xl px-4 py-3 text-sm text-textPrimary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                          {CREATORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
              </div>
          </div>

          <div className="flex items-center justify-end gap-4 py-8 sticky -bottom-2 bg-white/80 backdrop-blur-md border-t border-borderLight mt-10 z-10 transition-all">
              <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 font-bold text-textSecondary hover:text-textPrimary transition-all rounded-2xl hover:bg-surface"
              >
                  Abort
              </button>
              <button 
                  type="submit"
                  className="px-10 py-3 bg-primary text-white font-bold rounded-2xl transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                  {editingOrder ? 'Sync Changes' : 'Initialize Order'}
              </button>
          </div>
       </form>
    </Modal>
  );
};

export default CreateOrderModal;
