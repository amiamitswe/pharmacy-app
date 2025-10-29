import React from "react";
import { NavLink } from "react-router";

const links = [
  // { id: 1, label: "Dashboard", to: "/admin" },
  { id: 2, label: "Companies", to: "/admin/companies" },
  { id: 3, label: "Products", to: "/admin/medicine" },
  { id: 4, label: "Categories", to: "/admin/categories" },
  { id: 5, label: "Users", to: "/admin/users" },
  { id: 6, label: "Settings", to: "/admin/settings" },
  { id: 7, label: "Help", to: "/admin/help" },
  { id: 8, label: "Contact", to: "/admin/contact" },
  { id: 9, label: "About", to: "/admin/about" },
  { id: 10, label: "Orders", to: "/admin/orders" },
];

function AdminLinks() {
  return (
    <div className="flex flex-col gap-2 mt-8">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <NavLink
              to={link.to}
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "bg-teal-400 text-white h-10 flex items-center justify-start px-4 rounded-md text-base"
                  : "text-base text-gray-500 dark:text-gray-300 hover:bg-teal-500 hover:text-white h-10 flex items-center justify-start px-4 rounded-md"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminLinks;
