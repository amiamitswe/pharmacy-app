import api from "./axios-config/axios";

const medicineService = {
  getList: async (page = 1, limit = 10) => {
    const response = await api.get(`/medicine?page=${page}&limit=${limit}`);
    return response;
  },
};

export default medicineService;
