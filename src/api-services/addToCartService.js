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
  
  updateCartItemQuantity: async (itemId, quantity) => {
    const response = await api.patch(`/shopping-cart/update-cart/${itemId}`, { quantity });
    return response;
  },

  deleteCartItem: async (itemId) => {
    const response = await api.delete(`/shopping-cart/delete-cart-item/${itemId}`);
    return response;
  },
};
export default addToCartService;
