import api from "./axios-config/axios";

const orderService = {
  placeOrder: async (payload) => {
    const response = await api.post("/orders", payload);
    return response;
  },

  getOrders: async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response;
  },

  getOrdersByAdmin: async (params = {}) => {
    const response = await api.get("/orders/admin/active-orders", {
      params,
    });
    return response;
  },
};

export default orderService;
