// import React from "react";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const Layout = () => {
//   // Check if user is logged in

//   const darkMode = useSelector((state) => state.theme.darkMode);

//   return (
//     <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
//       <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//         <Sidebar />
//         <main className="flex-1 overflow-auto p-8 text-gray-900 dark:text-gray-100">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;



import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdRocketLaunch } from "react-icons/md";

const Layout = () => {
  // Check if user is logged in
  const url = window.location.href
  const navigate=useNavigate()
  const user = localStorage.getItem("userdetails")
  useEffect(() => {
    // Check immediately after mount
    
    if(!user){
      navigate("/")
      return;
    }
    
  }, [url]);

  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    user && (
      <div className="min-h-screen">
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-gray-100">
            {/* Mobile top bar */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 select-none">
                <MdRocketLaunch size={22} />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Expensio</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                aria-label="Open sidebar"
              >
                ☰ 
              </button>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    )
  );
};

export default Layout;
