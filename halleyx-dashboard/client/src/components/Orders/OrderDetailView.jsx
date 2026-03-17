import React, { useState } from 'react';
import { User, MapPin, Package, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { paymentsApi } from '../../api';
import toast from 'react-hot-toast';
import { API_BASE_URL as API_URL } from '../../config';

const OrderDetailView = ({ data }) => {
  const [isPaying, setIsPaying] = useState(false);
  
  if (!data) return null;

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const response = await paymentsApi.createSession(data._id);

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const isPending = data?.orderInfo?.status === 'Pending';
  const isPaid = data?.orderInfo?.status === 'Completed';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Customer Info */}
      <section>
        <div className="flex items-center gap-2 text-primary mb-4 font-semibold uppercase tracking-wider text-[10px]">
          <User size={14} />
          Customer Protocol
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
            {data?.customer?.firstName?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-textPrimary text-lg leading-tight">{data?.customer?.firstName} {data?.customer?.lastName}</h3>
            <p className="text-sm text-textSecondary mt-0.5">{data?.customer?.email}</p>
            <p className="text-xs text-textTertiary mt-1 font-mono">{data?.customer?.phoneNumber}</p>
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section>
        <div className="flex items-center gap-2 text-primary mb-4 font-semibold uppercase tracking-wider text-[10px]">
          <MapPin size={14} />
          Deployment Logistics
        </div>
        <div className="bg-surfaceHover/50 p-4 rounded-xl border border-borderLight text-sm text-textSecondary leading-relaxed transition-colors duration-300">
          {data?.customer?.streetAddress}<br />
          {data?.customer?.city}, {data?.customer?.stateProvince}<br />
          {data?.customer?.postalCode}, {data?.customer?.country}
        </div>
      </section>

      {/* Product Details */}
      <section>
        <div className="flex items-center gap-2 text-primary mb-4 font-semibold uppercase tracking-wider text-[10px]">
          <Package size={14} />
          Artifact Specifications
        </div>
        <div className="space-y-4">
           <div className="flex justify-between items-start gap-4 p-4 border border-borderLight rounded-2xl bg-surface transition-colors duration-300 shadow-sm">
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-surfaceHover rounded-xl flex items-center justify-center text-textTertiary">
                    <Package size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-textPrimary">{data?.orderInfo?.product}</h4>
                    <p className="text-xs text-textSecondary mt-1">Quantity: {data?.orderInfo?.quantity} unit(s)</p>
                    <p className="text-xs text-textSecondary">Unit Price: ${data?.orderInfo?.unitPrice}</p>
                 </div>
              </div>
              <div className="h-full flex flex-col justify-between items-end gap-2">
                 <span className="font-bold text-textPrimary text-lg">${data?.totalAmount?.toFixed(2)}</span>
                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    data?.orderInfo?.status === 'Completed' 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : data?.orderInfo?.status === 'In Progress' 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                 }`}>
                   {data?.orderInfo?.status}
                 </span>
              </div>
           </div>
        </div>
      </section>

      {/* Payment Status Notification */}
      {isPaid && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 text-emerald-600">
          <ShieldCheck size={20} />
          <div className="text-sm">
            <p className="font-bold">Transaction Confirmed</p>
            <p className="opacity-80">This order protocol has been fully settled via Stripe.</p>
          </div>
        </div>
      )}

      {/* Order Timeline */}
      <section>
         <div className="flex items-center gap-2 text-primary mb-4 font-semibold uppercase tracking-wider text-[10px]">
           <Clock size={14} />
           Execution Timeline
         </div>
         <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-borderLight">
            <div className="relative pl-8">
               <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface shadow-sm ring-1 ring-primary/20 transition-colors duration-300"></div>
               <p className="text-sm font-bold text-textPrimary">Protocol Initiated</p>
               <p className="text-xs text-textTertiary mt-1">{data?.orderInfo?.orderDate ? format(new Date(data?.orderInfo?.orderDate), 'MMM dd, yyyy p') : ''}</p>
            </div>
            <div className="relative pl-8">
               <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-surface shadow-sm ring-1 transition-colors duration-300 ${isPaid ? 'bg-primary ring-primary/20' : 'bg-surfaceHover ring-borderLight'}`}></div>
               <p className={`text-sm font-semibold ${isPaid ? 'text-textPrimary' : 'text-textSecondary'}`}>Payment Verification</p>
               <p className="text-xs text-textTertiary mt-1">{isPaid ? 'Transaction successfully validated' : 'Awaiting financial settlement'}</p>
            </div>
         </div>
      </section>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-borderLight flex gap-3 transition-colors duration-300">
         <button className="flex-1 py-3 px-4 bg-surface border border-borderLight rounded-xl font-bold text-textSecondary hover:text-textPrimary hover:bg-surfaceHover transition-all shadow-sm">
            Withdraw Protocol
         </button>
         {isPending ? (
           <button 
             onClick={handlePayment}
             disabled={isPaying}
             className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
           >
              {isPaying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              Pay With Stripe
           </button>
         ) : (
           <button className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Finalize Execution
           </button>
         )}
      </div>
    </div>
  );
};

export default OrderDetailView;
