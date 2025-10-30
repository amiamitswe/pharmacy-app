import api from "./axios-config/axios";

const medicineTypeService = {
  getList: async (sort = "medicineType", q = "") => {
    const response = await api.get(`/medicine-type?sort=${sort}&q=${q}`);
    return response;
  },

  addNewMedicineType: async (data) => {
    const response = await api.post("/medicine-type", data);
    return response;
  },
};

export default medicineTypeService;
