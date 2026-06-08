import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdReceiptLong,
  MdInsertChart,
  MdLogout,
  MdRocketLaunch,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { toggleTheme } from "../redux/theme/themeSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = JSON.parse(localStorage.getItem("userdetails") || "{}");
  const selectedProfile = userDetails.selectedProfile || 0;
  const profilePics = [
    null,
    "/images/profilepictures/boy.png",
    "/images/profilepictures/man.png",
    "/images/profilepictures/woman.png",
    "/images/profilepictures/purplehair.png",
  ];

  // Read theme from Redux
  const darkMode = useSelector((state) => state.theme.darkMode);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={24} /> },
    {
      name: "Categories",
      path: "/categories",
      icon: <MdAccountBalanceWallet size={24} />,
    },
    { name: "Expenses", path: "/expenses", icon: <MdReceiptLong size={24} /> },
    // {
    //   name: "Analytics",
    //   path: "/analytics",
    //   icon: <MdInsertChart size={24} />,
    // },
    { name: "Reports", path: "/reports", icon: <MdInsertChart size={24} /> },
  ];

  const handleLogout = () => {
    if(window.confirm("are you sure you want to log out ?")==true){
    localStorage.removeItem("userdetails");
    navigate("/");
    }
  };

  return (
    <div
      className={`h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300 fixed inset-y-0 left-0 z-40 transform lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <MdRocketLaunch size={28} />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Expensio
          </span>
        </div>

        {/* Redux Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:ring-2 ring-indigo-300 transition-all"
          >
            {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:ring-2 ring-indigo-300 transition-all"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
            >
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
       <button 
  onClick={handleLogout}
  className="relative flex w-full items-center justify-between px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer hover:cursor-pointer"
>
  {/* Your button content unchanged */}

  {/* Left: Profile + Username + Logout (horizontal) */}
  <div className="flex items-center gap-3 flex-shrink-0">
    {/* Profile Picture */}
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
      {selectedProfile === 0 ? (
        <FaCircleUser size={20} className="text-gray-500" />
      ) : (
        <img 
          src={profilePics[selectedProfile] || "/images/profilepictures/boy.png"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      )}
    </div>
    {/* Username right of profile */}
    <div className="text-sm font-medium truncate">
      {userDetails.username || "User"}
    </div>
    {/* Logout rightmost */}
    <MdLogout size={24} />
  </div>
  
  {/* Email - Directly below profile, centered under left group */}
  <div className="text-xs text-gray-500 absolute left-16 bottom-2 truncate max-w-[200px]">
    {userDetails.email || ""}
  </div>
</button>



      </div>
    </div>
  );
};

export default Sidebar;
