import api from "./axios-config/axios";

const medicineService = {
  getList: async ({ page = 1, limit = 10, q = "" }) => {
    const response = await api.get(
      `/medicine?page=${page}&limit=${limit}&q=${q}`
    );
    return response;
  },

  getMedicineById: async (id) => {
    const response = await api.get(`/medicine/${id}`);
    return response;
  },

  uploadImages: async (formData) => {
    const response = await api.post("/medicine/upload-image", formData, {
      headers: {
        // Let Axios auto-set the multipart boundary
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  saveMedicine: async (data) => {
    const response = await api.post("/medicine", data);
    return response;
  },
};

export default medicineService;
