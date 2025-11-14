import api from "./axios-config/axios";

const addToCartService = {
  addToCard: async (payload) => {
    const response = await api.post("/shopping-cart/add-to-cart", payload);
    return response;
  },

  getCartItems: async () => {
    const response = await api.get("/shopping-cart");
    return response;
  },
};
export default addToCartService;
