import api from "./axios-config/axios";

const orderService = {
  placeOrder: async (payload) => {
    const response = await api.post("/orders", payload);
    return response;
  },
};

export default orderService;
