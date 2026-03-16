import api from './axios';

export const ordersApi = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};export const paymentsApi = {
  getBills: async () => {
    const response = await api.get('/orders');
    return response.data.filter(o => o.orderInfo.status === 'Pending');
  },
  getHistory: async () => {
    const response = await api.get('/orders');
    return response.data.filter(o => o.orderInfo.status === 'Completed');
  },
  createSession: async (orderId) => {
    const response = await api.post('/payments/create-session', { orderId });
    return response.data;
  }
};

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) localStorage.setItem('token', response.data.token);
    return response.data;
  },
  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    if (response.data.token) localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const dashboardsApi = {
  // Get all dashboards (usually there's only one in this setup, or we pick the first)
  getDashboards: async () => {
    const response = await api.get('/dashboards');
    return response.data;
  },

  // Save the layout adjustments back to the database
  updateDashboard: async (id, payload) => {
    const response = await api.put(`/dashboards/${id}`, payload);
    return response.data;
  },

  createDashboard: async (payload) => {
    const response = await api.post('/dashboards', payload);
    return response.data;
  },

  deleteDashboard: async (id) => {
    const response = await api.delete(`/dashboards/${id}`);
    return response.data;
  }
};

export const analyticsApi = {
  // Trigger Auto-Generation
  autoGenerate: async () => {
    const response = await api.post('/analytics/auto-generate');
    return response.data;
  },

  // Trigger AI-Generation
  aiGenerate: async (prompt) => {
    const response = await api.post('/analytics/ai-generate', { prompt });
    return response.data;
  },

  // Trigger AI-Analysis
  aiAnalyze: async (prompt, history = []) => {
    const response = await api.post('/analytics/ai-analyze', { prompt, history });
    return response.data;
  },

  // Fetch data specifically tailored to a single widget's config logic + Date Filter
  getWidgetData: async (widgetId, dateRange, type, config) => {
    const response = await api.post('/analytics/data', { widgetId, dateRange, type, config });
    return response.data;
  }
};
