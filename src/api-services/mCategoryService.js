import api from "./axios-config/axios";

const mCategoryService = {
  getList: async () => {
    const response = await api.get("/category");
    return response;
  },

  addNewCategory: async ({ categoryName, details }) => {
    const response = await api.post("/category", {
      categoryName,
      details,
    });
    return response;
  },
};

export default mCategoryService;
