//old version of code here 
// import { Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import "./App.css";
// import Dashboard from "./pages/Dashboard";
// import Categories from "./pages/Categories";
// import Analytics from "./pages/Analytics";
// import Expenses from "./pages/Expenses";
// import Reports from "./pages/Reports";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Layout from "./components/Layout";

// function App() {
//   const darkMode = useSelector((state) => state.theme.darkMode);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   return (
//     <div className="min-h-screen">
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route element={<Layout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/expenses" element={<Expenses />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/reports" element={<Reports />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Categories = React.lazy(() => import("./pages/Categories"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Expenses = React.lazy(() => import("./pages/Expenses"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Layout = React.lazy(() => import("./components/Layout"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      Loading...
    </div>
  );
}

function App() {
  return (
    <div>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Analytics />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/expenses" element={<Expenses />} />
            {/* <Route path="/analytics" element={<Analytics />} /> */}
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
