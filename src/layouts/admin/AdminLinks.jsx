import { NavLink, useParams, useLocation } from "react-router";
import { adminLinks } from "../../routePaths";
import { Button } from "@heroui/react";
import { useState } from "react";

function AdminLinks({ onClose = () => {} }) {
  const path = useLocation();
  const [openAccordions, setOpenAccordions] = useState({});

  const toggleAccordion = (linkId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [linkId]: !prev[linkId],
    }));
  };

  console.log(path);
  return (
    <div className="md:mt-8">
      <ul className="flex flex-col gap-2">
        {adminLinks?.map((link) => (
          <li key={link.id}>
            {link?.items?.length > 0 ? (
              <div>
                <Button
                  onClick={() => toggleAccordion(link.id)}
                  className={`w-full h-10 flex items-center justify-between px-4 rounded-md text-lg font-normal  ${
                    path?.pathname?.includes("/admin/settings")
                      ? "bg-teal-400 text-white"
                      : "text-gray-500 bg-transparent dark:text-gray-300 hover:bg-teal-500 hover:text-white "
                  }`}
                >
                  <span>{link.label}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      openAccordions[link.id] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openAccordions[link.id]
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="flex flex-col gap-2 mt-2">
                    {link?.items?.map((item) => (
                      <li key={item.id}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive, isPending }) =>
                            isPending
                              ? "pending"
                              : isActive
                              ? "bg-teal-400 text-white h-10 flex items-center justify-start px-4 rounded-md text-lg font-medium pl-8"
                              : "text-lg text-gray-500 dark:text-gray-300 hover:bg-teal-500 hover:text-white h-10 flex items-center justify-start px-4 rounded-md pl-8"
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "bg-teal-400 text-white h-10 flex items-center justify-start px-4 rounded-md text-lg font-medium"
                    : "text-lg text-gray-500 dark:text-gray-300 hover:bg-teal-500 hover:text-white h-10 flex items-center justify-start px-4 rounded-md"
                }
              >
                {link.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminLinks;
