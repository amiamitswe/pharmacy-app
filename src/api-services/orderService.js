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

  updateOrderStatusByAdmin: async (payload) => {
    const response = await api.put(
      `/orders/admin/update-order-status/${payload.orderId}`,
      {
        orderStatus: payload.orderStatus,
      }
    );
    return response;
  },
};

export default orderService;
