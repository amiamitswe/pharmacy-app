import api from "./axios-config/axios";

const mCategoryService = {
  getList: async () => {
    const response = await api.get("/category");
    return response;
  },

  // addNewCompany: async ({ company, country }) => {
  //   const response = await api.post("/company", {
  //     company,
  //     country,
  //   });
  //   return response;
  // },
};

export default mCategoryService;
