import api from "./axios-config/axios";

const userService = {
  signup: async (fullName, email, phone, password) => {
    const response = await api.post("/user/signup", {
      name: fullName,
      email,
      phone,
      password,
    });
    return response;
  },

  login: async (email, password) => {
    const response = await api.post("/user/login", {
      username: email,
      password,
    });

    return response;
  },

  logout: async () => {
    const response = await api.delete("/user/logout");
    return response;
  },

  profile: async () => {
    const response = await api.get("/user");
    return response;
  },

  updateProfile: async (payload) => {
    // Check if payload is FormData (for file uploads)
    const isFormData = payload instanceof FormData;
    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};
    const response = await api.put("/user/update", payload, config);
    return response;
  },

  getAllUsers: async (payload) => {
    const response = await api.get("/user/get-all-users", {
      params: payload,
    });
    return response;
  },

  getUserAddress: async (query) => {
    const response = await api.get(`/user/address`, {
      params: query,
    });
    return response;
  },

  addUserAddress: async (addressData) => {
    const response = await api.post(`/user/address`, addressData);
    return response;
  },

  makeDefaultAddress: async (addressId) => {
    const response = await api.patch(`/user/address/${addressId}/make-default`);
    return response;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/user/address/${addressId}`);
    return response;
  },
};

export default userService;
