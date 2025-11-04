import api from "./axios-config/axios";

const medicineGenericService = {
  getList: async () => {
    const response = await api.get("/generic?limit=100");
    return response;
  },

  addNewGeneric: async (payload) => {
    const response = await api.post("/generic", {
      ...payload,
    });
    return response;
  },
};

export default medicineGenericService;
