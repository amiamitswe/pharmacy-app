import api from "./axios-config/axios";

const companyService = {
  getList: async () => {
    const response = await api.get("/company");
    return response;
  },

  addNewCompany: async ({ company, country }) => {
    const response = await api.post("/company", {
      company,
      country,
    });
    return response;
  },
};

export default companyService;
