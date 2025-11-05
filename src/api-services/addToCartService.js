import api from "./axios-config/axios";

const addToCartService = {
  addToCard: async (payload) => {
    const response = await api.post("/shopping-cart/add-to-cart", payload);
    return response;
  },
};
export default addToCartService;
