import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api';
import toast from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';
import { Plus, Search, Filter, MoreHorizontal, Eye, Trash2, ChevronRight, Download, CreditCard, Loader2 } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import SideDrawer from '../components/UI/SideDrawer';
import OrderDetailView from '../components/Orders/OrderDetailView';
import CreateOrderModal from '../components/Orders/CreateOrderModal';

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Table');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Detail Panel
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  useEffect(() => {
    fetchOrders();
    
    // Handle payment results from Stripe
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      toast.success("Payment successful! Order processed.");
      navigate('/orders', { replace: true });
    } else if (params.get('cancelled')) {
      toast.error("Payment cancelled.");
      navigate('/orders', { replace: true });
    }
  }, [location.search]);

  const handlePayment = async (e, orderId) => {
    e.stopPropagation();
    setIsProcessingPayment(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/payments/create-session',
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment.');
    } finally {
      setIsProcessingPayment(null);
    }
  };

  const fetchOrders = async () => {
    try {
       const data = await ordersApi.getOrders();
       setOrders(data);
    } catch (err) {
       toast.error("Failed to load orders");
    } finally {
       setIsLoading(false);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsPanelOpen(true);
  };

  const handleOpenCreate = () => {
    setOrderToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
        if (orderToEdit) {
            await ordersApi.updateOrder(orderToEdit._id, orderData);
            toast.success("Order updated successfully!");
        } else {
            await ordersApi.createOrder(orderData);
            toast.success("Order created successfully!");
        }
        fetchOrders();
        setIsFormModalOpen(false);
    } catch (err) {
        toast.error("An error occurred");
    }
  };

  const filteredOrders = orders.filter(o => {
    const search = searchTerm.toLowerCase();
    const customer = o.customer || {};
    const id = o._id || "";
    const product = (o.orderInfo && o.orderInfo.product) || "";
    const status = (o.orderInfo && o.orderInfo.status) || "";
    return (
      (customer.email || "").toLowerCase().includes(search) || 
      (customer.firstName || "").toLowerCase().includes(search) ||
      (customer.lastName || "").toLowerCase().includes(search) ||
      id.toLowerCase().includes(search) ||
      product.toLowerCase().includes(search) ||
      status.toLowerCase().includes(search)
    );
  });

  const handleDeleteOrder = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Confirm permanent removal of this order protocol?")) {
      try {
        await ordersApi.deleteOrder(id);
        toast.success("Protocol purged successfully");
        fetchOrders();
      } catch (err) {
        toast.error("Deletion failed");
      }
    }
  };

  const handleEditOrder = (e, order) => {
    e.stopPropagation();
    setOrderToEdit(order);
    setIsFormModalOpen(true);
  };

  return (
    <MainLayout title="Customer Orders">
      <div className="animate-fade-in">
        {/* Tabs Navigation */}
        <div className="flex items-center gap-8 border-b border-borderLight mb-8">
          {['Dashboard', 'Table'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-textTertiary hover:text-textSecondary'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Dashboard' ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-64 h-64 bg-surfaceHover rounded-full flex items-center justify-center mb-8">
                <div className="w-48 h-48 bg-surface rounded-3xl shadow-xl flex items-center justify-center border border-borderLight transition-colors duration-300">
                   <div className="space-y-3 w-full px-6 text-textTertiary">
                      <div className="h-2 w-2/3 bg-surfaceHover rounded-full mx-auto" />
                      <div className="h-2 w-full bg-surfaceHover rounded-full mx-auto" />
                      <div className="h-2 w-1/2 bg-surfaceHover rounded-full mx-auto" />
                   </div>
                </div>
             </div>
             <h2 className="text-2xl font-bold text-textPrimary tracking-tight">Dashboard Not Configured</h2>
             <p className="text-textSecondary mt-2 max-w-sm mx-auto">
               You haven't set up any widgets for your order dashboard yet. Start by adding your first metric.
             </p>
              <Link 
                to="/dashboard"
                className="mt-8 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-block"
              >
                 Configure dashboard
              </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                   <div className="relative flex-1 max-w-md transition-colors duration-300">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textTertiary" />
                      <input 
                        type="text" 
                        placeholder="Search orders, customers..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-borderLight rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all text-textPrimary"
                      />
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-borderLight rounded-xl text-sm font-bold text-textSecondary hover:bg-surfaceHover transition-all relative">
                      <Filter size={18} />
                      Filter
                      <span className="w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-surface absolute -top-1 -right-1 transition-colors duration-300">2</span>
                   </button>
               </div>
                              <div className="flex items-center gap-3">
                   <button 
                     onClick={() => {
                        const headers = ["Order#", "Status", "Customer", "Product", "Total"];
                        const rows = filteredOrders.map(o => [
                          o._id, 
                          o.orderInfo?.status || "Pending",
                          `${o.customer?.firstName} ${o.customer?.lastName}`,
                          o.orderInfo?.product || "N/A",
                          `$${(o.orderInfo?.totalAmount || 0).toFixed(2)}`
                        ]);
                        const csvContent = "data:text/csv;charset=utf-8," 
                          + headers.join(",") + "\n"
                          + rows.map(e => e.join(",")).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `Halleyx_Orders_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("CSV Export Triggered");
                     }}
                     className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-borderLight rounded-xl text-sm font-bold text-textSecondary hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                   >
                     <Download size={18} />
                     Export CSV
                   </button>
                   <button 
                     onClick={handleOpenCreate}
                     className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                   >
                     <Plus size={18} />
                     Create Order
                   </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="table-container">
                <table className="w-full text-sm text-left transition-colors duration-300">
                   <thead className="bg-surface border-b border-borderLight text-textTertiary font-bold uppercase tracking-wider text-[11px] transition-colors duration-300">
                      <tr>
                         <th className="px-6 py-4">S.no</th>
                         <th className="px-6 py-4">Order Number</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Customer</th>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                  <tbody className="divide-y divide-borderLight">
                     {isLoading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                              <span className="text-textTertiary font-medium">Loading orders...</span>
                            </div>
                          </td>
                        </tr>
                     ) : filteredOrders.length === 0 ? (
                        <tr>
                           <td colSpan="7" className="px-6 py-12 text-center italic text-textTertiary">No orders found matching your search.</td>
                        </tr>
                     ) : (
                        filteredOrders.map((order, index) => (
                           <tr 
                             key={order._id} 
                             onClick={() => handleRowClick(order)}
                             className="hover:bg-primary/5 cursor-pointer transition-colors group border-b border-borderLight/30"
                           >
                              <td className="px-6 py-4 font-medium text-textTertiary">{index + 1}</td>
                              <td className="px-6 py-4">
                                 <span className="font-bold text-textPrimary">ORD-{order._id.substring(18).toUpperCase()}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`badge ${order.orderInfo.status === 'Completed' ? 'badge-completed' : order.orderInfo.status === 'In Progress' ? 'badge-progress' : 'badge-refunded'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${order.orderInfo.status === 'Completed' ? 'bg-primary' : order.orderInfo.status === 'In Progress' ? 'bg-secondary' : 'bg-textSecondary'}`} />
                                    {order.orderInfo.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <div>
                                    <p className="font-bold text-textPrimary leading-none">{order.customer.firstName} {order.customer.lastName}</p>
                                    <p className="text-[11px] text-textTertiary mt-1">{order.customer.email}</p>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-textSecondary font-medium">
                                 {format(new Date(order.orderInfo.orderDate), 'MMM dd, yyyy')}
                              </td>
                               <td className="px-6 py-4 font-bold text-textPrimary">
                                  ${(order.totalAmount || order.orderInfo?.totalAmount || 0).toFixed(2)}
                               </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                       onClick={(e) => handleEditOrder(e, order)}
                                       className="p-2 text-textTertiary hover:text-primary hover:bg-surfaceHover rounded-lg transition-all" 
                                       title="Edit"
                                     >
                                       <Eye size={18} />
                                     </button>
                                     <button 
                                       onClick={(e) => handleDeleteOrder(e, order._id)}
                                       className="p-2 text-textTertiary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" 
                                       title="Delete"
                                     >
                                       <Trash2 size={18} />
                                     </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Detail Panel */}
        <SideDrawer 
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)} 
          title="Order Documentation"
          description="Detailed overview of order fulfillment and logistics."
        >
          <OrderDetailView data={selectedOrder} />
        </SideDrawer>

        {/* Form Modal */}
        <CreateOrderModal 
           isOpen={isFormModalOpen}
           onClose={() => setIsFormModalOpen(false)}
           onSave={handleSaveOrder}
           editingOrder={orderToEdit}
        />
      </div>
    </MainLayout>
  );
};

export default Orders;
