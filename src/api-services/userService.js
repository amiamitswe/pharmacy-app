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
};

export default userService;
