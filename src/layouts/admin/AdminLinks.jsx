import { NavLink } from "react-router";
import { adminLinks } from "../../routePaths";

function AdminLinks({ onClose = () => {} }) {
  return (
    <div className="md:mt-8">
      <ul className="flex flex-col gap-2">
        {adminLinks?.map((link) => (
          <li key={link.id}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminLinks;
