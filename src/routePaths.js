const adminLinks = [
  { id: 0, label: "Dashboard", to: "/admin/dashboard" },
  { id: 5, label: "Users", to: "/admin/users" },
  {
    id: 6,
    label: "Settings",
    items: [
      {
        id: 61,
        label: "Companies",
        to: "/admin/settings/companies",
      },
      {
        id: 62,
        label: "Medicines",
        to: "/admin/settings/medicine",
      },
      {
        id: 63,
        label: "Medicine Form",
        to: "/admin/settings/medicine_form",
      },
      {
        id: 64,
        label: "Categories",
        to: "/admin/settings/medicine_categories",
      },
      {
        id: 65,
        label: "Generic",
        to: "/admin/settings/medicine_generic",
      },
    ],
  },
  { id: 7, label: "Help", to: "/admin/help" },
  { id: 8, label: "Contact", to: "/admin/contact" },
  { id: 9, label: "About", to: "/admin/about" },
  { id: 10, label: "Orders", to: "/admin/orders" },
  { id: 11, label: "Editor", to: "/admin/editor" },
];

const userLinks = [
  { id: 1, label: "Profile", to: "/user/profile" },
  { id: 122, label: "Address Book", to: "/user/address-book" },
  { id: 2, label: "Orders", to: "/user/orders" },
  { id: 3, label: "Shopping Cart", to: "/user/shopping-cart" },
];

export { adminLinks, userLinks };
